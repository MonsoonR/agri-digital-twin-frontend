// src/types/field.ts
// 田块指标和时间序列类型

// 水稻生育阶段
export type GrowthStage =
  | "分蘖期"
  | "拔节期"
  | "孕穗期"
  | "抽穗期"
  | "灌浆期"
  | "成熟期";

// 最新田块指标
export type FieldMetric = {
  timestamp?: string;
  growthIndex?: number; // 作物长势指数（0-1）
  maturity?: number; // 成熟期预测（0-100）
  chlorophyll?: number; // 叶绿素
  lai?: number; // 叶面积指数
  plantHeight?: number; // 株高
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  soilPH?: number;
  organicMatter?: number;
  salinity?: number;
};

// 关键指标时间序列点
export type MetricHistoryPoint = {
  timestamp: string;
  label: string;
  yield: number; // 生产力 / 产量指数 0-100
  growthIndex: number; // 生长进度 0-100
  maturity?: number;
  chlorophyll?: number;
  lai?: number;
  plantHeight?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  soilPH?: number;
  organicMatter?: number;
  salinity?: number;
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

export type FieldHistoryPoint = MetricHistoryPoint;
