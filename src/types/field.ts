export type FieldMetric = {
  timestamp: string; // ISO 字符串
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
  healthScore: number;
  lastUpdated: string;
  latestMetric: FieldMetric;
};

/**
 * 每块田的历史数据点（假数据结构）
 * label: 时间/阶段标签，比如 "4月"、"孕穗期"
 * yield: 该时间点的产量指数
 * growthIndex: 生长进度 0-100
 */
export type FieldHistoryPoint = {
  label: string;
  yield: number;
  growthIndex: number;
};
