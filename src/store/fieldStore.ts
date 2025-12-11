// src/store/fieldStore.ts
import { create } from "zustand";
import type { FieldStatus, FieldHistoryPoint, MetricHistoryPoint } from "../types/field";
import { fetchFieldStatuses, fetchFieldHistory, fetchFieldMetricSeries } from "../api/field";

type LightingMode = "auto" | "manual";

type FieldStore = {
  fields: FieldStatus[];
  loading: boolean;
  error?: string;

  selectedFieldId?: string;
  hoveredFieldId?: string;

  history: FieldHistoryPoint[];
  historyLoading: boolean;
  historyError?: string;
  historyByField: Record<string, FieldHistoryPoint[]>;

  metricSeries: MetricHistoryPoint[];
  metricLoading: boolean;
  metricError?: string;
  metricsByField: Record<string, MetricHistoryPoint[]>;

  // 光照控制
  lightingMode: LightingMode;
  manualLightOn: boolean;
  lightThreshold: number;

  loadFields: () => Promise<void>;
  loadFieldHistory: (fieldId: string) => Promise<void>;
  loadFieldMetrics: (fieldId: string) => Promise<void>;
  setSelectedField: (id?: string) => void;
  setHoveredField: (id?: string) => void;

  setLightingMode: (mode: LightingMode) => void;
  setManualLightOn: (on: boolean) => void;

  getSelectedField: () => FieldStatus | undefined;
};

export const useFieldStore = create<FieldStore>((set, get) => ({
  fields: [],
  loading: false,
  error: undefined,

  selectedFieldId: undefined,
  hoveredFieldId: undefined,

  history: [],
  historyLoading: false,
  historyError: undefined,
  historyByField: {},

  metricSeries: [],
  metricLoading: false,
  metricError: undefined,
  metricsByField: {},

  lightingMode: "auto",
  manualLightOn: false,
  lightThreshold: 800,

  async loadFields() {
    try {
      set({ loading: true, error: undefined });
      const data = await fetchFieldStatuses();

      set((state) => {
        const defaultId = state.selectedFieldId ?? data[0]?.id;
        return {
          fields: data,
          loading: false,
          selectedFieldId: defaultId,
        };
      });

      const id = get().selectedFieldId;
      if (id) {
        get().loadFieldHistory(id);
        get().loadFieldMetrics(id);
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "加载田块数据失败",
      });
    }
  },

  async loadFieldHistory(fieldId: string) {
    try {
      const cached = get().historyByField[fieldId];
      if (cached) {
        set({ history: cached });
        return;
      }

      set({ historyLoading: true, historyError: undefined });
      const data = await fetchFieldHistory(fieldId);
      set((state) => ({
        history: data,
        historyLoading: false,
        historyByField: { ...state.historyByField, [fieldId]: data },
      }));
    } catch (err: any) {
      set({
        historyLoading: false,
        historyError: err?.message ?? "历史数据加载失败",
      });
    }
  },

  async loadFieldMetrics(fieldId: string) {
    try {
      const cached = get().metricsByField[fieldId];
      if (cached) {
        set({ metricSeries: cached });
        return;
      }
      set({ metricLoading: true, metricError: undefined });
      const data = await fetchFieldMetricSeries(fieldId);
      set((state) => ({
        metricSeries: data,
        metricLoading: false,
        metricsByField: { ...state.metricsByField, [fieldId]: data },
      }));
    } catch (err: any) {
      set({
        metricLoading: false,
        metricError: err?.message ?? "关键指标加载失败",
      });
    }
  },

  setSelectedField(id) {
    const { historyByField, metricsByField } = get();
    set({
      selectedFieldId: id,
      history: id && historyByField[id] ? historyByField[id] : [],
      metricSeries: id && metricsByField[id] ? metricsByField[id] : [],
    });
    if (id) {
      get().loadFieldHistory(id);
      get().loadFieldMetrics(id);
    } else {
      set({ history: [], metricSeries: [] });
    }
  },

  setHoveredField(id) {
    set({ hoveredFieldId: id });
  },

  setLightingMode(mode) {
    set({ lightingMode: mode });
  },

  setManualLightOn(on) {
    set({ manualLightOn: on });
  },

  getSelectedField() {
    const { fields, selectedFieldId } = get();
    if (!selectedFieldId) return undefined;
    return fields.find((f) => f.id === selectedFieldId);
  },
}));
