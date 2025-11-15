// src/store/fieldStore.ts
import { create } from "zustand";
import type { FieldStatus } from "../types/field";
import { fetchFieldStatuses } from "../api/field";

type FieldStore = {
  fields: FieldStatus[];
  loading: boolean;
  error?: string;

  selectedFieldId?: string;
  hoveredFieldId?: string;

  // actions
  loadFields: () => Promise<void>;
  setSelectedField: (id?: string) => void;
  setHoveredField: (id?: string) => void;

  // 便利函数
  getSelectedField: () => FieldStatus | undefined;
};

export const useFieldStore = create<FieldStore>((set, get) => ({
  fields: [],
  loading: false,
  error: undefined,

  selectedFieldId: undefined,
  hoveredFieldId: undefined,

  async loadFields() {
    try {
      set({ loading: true, error: undefined });
      const data = await fetchFieldStatuses();
      set((state) => ({
        fields: data,
        loading: false,
        // 如果之前没有选中，就默认选第一个
        selectedFieldId: state.selectedFieldId ?? data[0]?.id,
      }));
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? "未知错误" });
    }
  },

  setSelectedField(id) {
    set({ selectedFieldId: id });
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
