// src/api/field.ts
import type { FieldStatus, FieldHistoryPoint } from "../types/field";

const now = new Date().toISOString();

const makeMetric = (
  temperature: number,
  humidity: number,
  light: number,
  soilPH: number
) => ({
  timestamp: now,
  temperature,
  humidity,
  light,
  soilPH,
});

// 8 块田，分别设置不同状态
const MOCK_FIELDS: FieldStatus[] = [
  {
    id: "A1",
    name: "A1 区",
    row: 0,
    col: 0,
    healthScore: 0.9,
    growthStage: "孕穗期",
    lastUpdated: now,
    latestMetric: makeMetric(26.1, 78, 880, 6.2), // 健康
  },
  {
    id: "A2",
    name: "A2 区",
    row: 0,
    col: 1,
    healthScore: 0.72,
    growthStage: "灌浆期",
    lastUpdated: now,
    latestMetric: makeMetric(25.8, 72, 640, 6.1), // 光照略低
  },
  {
    id: "A3",
    name: "A3 区",
    row: 0,
    col: 2,
    healthScore: 0.55,
    growthStage: "抽穗期",
    lastUpdated: now,
    latestMetric: makeMetric(25.4, 69, 580, 6.0), // 光照偏低
  },
  {
    id: "A4",
    name: "A4 区",
    row: 0,
    col: 3,
    healthScore: 0.4,
    growthStage: "分蘖期",
    lastUpdated: now,
    latestMetric: makeMetric(24.9, 65, 560, 6.3), // 生长早期 + 光照不足
  },
  {
    id: "B1",
    name: "B1 区",
    row: 1,
    col: 0,
    healthScore: 0.68,
    growthStage: "拔节期",
    lastUpdated: now,
    latestMetric: makeMetric(26.0, 44, 860, 6.4), // 偏干
  },
  {
    id: "B2",
    name: "B2 区",
    row: 1,
    col: 1,
    healthScore: 0.48,
    growthStage: "拔节期",
    lastUpdated: now,
    latestMetric: makeMetric(25.5, 38, 820, 6.5), // 明显干旱
  },
  {
    id: "B3",
    name: "B3 区",
    row: 1,
    col: 2,
    healthScore: 0.52,
    growthStage: "抽穗期",
    lastUpdated: now,
    latestMetric: makeMetric(25.7, 62, 800, 5.0), // 土壤偏酸
  },
  {
    id: "B4",
    name: "B4 区",
    row: 1,
    col: 3,
    healthScore: 0.45,
    growthStage: "成熟期",
    lastUpdated: now,
    latestMetric: makeMetric(25.9, 60, 830, 7.1), // 土壤偏碱
  },
];

export async function fetchFieldStatuses(): Promise<FieldStatus[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_FIELDS;
}

// 历史数据模板
const BASE_HISTORY: FieldHistoryPoint[] = [
  { label: "4月", yield: 2200, growthIndex: 20 },
  { label: "5月", yield: 2600, growthIndex: 40 },
  { label: "6月", yield: 3100, growthIndex: 60 },
  { label: "7月", yield: 3400, growthIndex: 75 },
  { label: "8月", yield: 3600, growthIndex: 90 },
  { label: "9月", yield: 3800, growthIndex: 100 },
];

export async function fetchFieldHistory(
  fieldId: string
): Promise<FieldHistoryPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const factor =
    fieldId === "A1"
      ? 1.05
      : fieldId === "A2"
      ? 1.0
      : fieldId === "A3"
      ? 0.95
      : fieldId === "A4"
      ? 0.9
      : fieldId === "B1"
      ? 0.98
      : fieldId === "B2"
      ? 0.9
      : fieldId === "B3"
      ? 0.92
      : 0.88;

  return BASE_HISTORY.map((p, index) => ({
    label: p.label,
    yield: Math.round(p.yield * factor + index * 40),
    growthIndex: Math.min(
      100,
      Math.max(0, Math.round(p.growthIndex * factor + (factor - 1) * 20))
    ),
  }));
}
