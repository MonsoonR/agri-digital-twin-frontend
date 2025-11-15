// src/types/field.ts

// 单个时刻的指标（你们可以以后扩展，比如加 CO2、风速等）
export type FieldMetric = {
  timestamp: string; // ISO 字符串，例如 "2025-11-15T10:00:00Z"
  temperature: number; // 摄氏度
  humidity: number; // 百分比 0-100
  light: number; // 光照强度（单位随你们定）
  soilPH: number; // 土壤酸碱度
};

// 当前田块整体状态（列表接口返回的每一条）
export type FieldStatus = {
  id: string; // 田块唯一 ID，比如 "A1"
  name: string; // 显示用名称，比如 "A1 区"
  row: number; // 在网格中的行
  col: number; // 在网格中的列
  healthScore: number; // 0~1 的长势评分
  lastUpdated: string; // 最后更新时间
  latestMetric: FieldMetric; // 最新一条指标（方便 UI 展示）

  // 后面如果你们要做地图经纬度，也可以直接加：
  // centerLng?: number;
  // centerLat?: number;
};
