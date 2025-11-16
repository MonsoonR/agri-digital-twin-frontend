// src/types/field.ts

// 水稻生育阶段
export type GrowthStage =
  | "分蘖期"
  | "拔节期"
  | "孕穗期"
  | "抽穗期"
  | "灌浆期"
  | "成熟期";

export type FieldMetric = {
  timestamp: string;
  temperature: number;
  humidity: number;
  light: number;
  soilPH: number;
};

export type FieldStatus = {
  id: string;
  name: string;
  row: number;
  col: number;
  healthScore: number; // 0~1
  lastUpdated: string;
  latestMetric: FieldMetric;
  growthStage: GrowthStage;
};

export type FieldHistoryPoint = {
  label: string;      // 时间标签，例如 "4月"
  yield: number;      // 产量指数
  growthIndex: number; // 生长进度 0~100
};
