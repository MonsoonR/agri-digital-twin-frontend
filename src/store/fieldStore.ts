// src/store/fieldStore.ts
import { create } from "zustand";
import type { FieldStatus, FieldHistoryPoint } from "../types/field";
import { fetchFieldStatuses, fetchFieldHistory } from "../api/field";

type FieldStore = {
  fields: FieldStatus[];
  loading: boolean;
  error?: string;

  selectedFieldId?: string;
  hoveredFieldId?: string;

  history: FieldHistoryPoint[];
  historyLoading: boolean;
  historyError?: string;

  loadFields: () => Promise<void>;
  loadFieldHistory: (fieldId: string) => Promise<void>;
  setSelectedField: (id?: string) => void;
  setHoveredField: (id?: string) => void;

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

  async loadFields() {
    try {
      set({ loading: true, error: undefined });
      const data = await fetchFieldStatuses();

      // 先设置字段和默认选中田块
      set((state) => {
        const defaultId = state.selectedFieldId ?? data[0]?.id;
        return {
          fields: data,
          loading: false,
          selectedFieldId: defaultId,
        };
      });

      // 然后根据当前选中田块加载历史数据
      const id = get().selectedFieldId;
      if (id) {
        get().loadFieldHistory(id);
      }
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? "未知错误" });
    }
  },

  async loadFieldHistory(fieldId: string) {
    try {
      set({ historyLoading: true, historyError: undefined });
      const data = await fetchFieldHistory(fieldId);
      set({ history: data, historyLoading: false });
    } catch (err: any) {
      set({
        historyLoading: false,
        historyError: err?.message ?? "历史数据加载失败",
      });
    }
  },

  setSelectedField(id) {
    set({ selectedFieldId: id });
    if (id) {
      get().loadFieldHistory(id);
    } else {
      set({ history: [] });
    }
  },

  setHoveredField(id) {
    set({ hoveredFieldId: id });
  },

  getSelectedField() {
    const { fields, selectedFieldId } = get();
    if (!selectedFieldId) return undefined;
    return fields.find((f) => f.id === selectedFieldId);
  },
}));
