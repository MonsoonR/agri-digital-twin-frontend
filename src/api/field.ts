// src/api/field.ts
import type { FieldStatus, FieldHistoryPoint } from "../types/field";

// 这里先用假数据模拟后端返回
const MOCK_FIELDS: FieldStatus[] = [
  {
    id: "A1",
    name: "A1 区",
    row: 0,
    col: 0,
    healthScore: 0.9,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 26.3,
      humidity: 68,
      light: 820,
      soilPH: 6.4,
    },
  },
  {
    id: "A2",
    name: "A2 区",
    row: 0,
    col: 1,
    healthScore: 0.7,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 25.8,
      humidity: 70,
      light: 790,
      soilPH: 6.3,
    },
  },
  {
    id: "A3",
    name: "A3 区",
    row: 0,
    col: 2,
    healthScore: 0.5,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 25.1,
      humidity: 72,
      light: 760,
      soilPH: 6.2,
    },
  },
  {
    id: "A4",
    name: "A4 区",
    row: 0,
    col: 3,
    healthScore: 0.3,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 24.7,
      humidity: 75,
      light: 720,
      soilPH: 6.1,
    },
  },
  {
    id: "B1",
    name: "B1 区",
    row: 1,
    col: 0,
    healthScore: 0.8,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 26.0,
      humidity: 67,
      light: 840,
      soilPH: 6.5,
    },
  },
  {
    id: "B2",
    name: "B2 区",
    row: 1,
    col: 1,
    healthScore: 0.6,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 25.4,
      humidity: 69,
      light: 800,
      soilPH: 6.3,
    },
  },
  {
    id: "B3",
    name: "B3 区",
    row: 1,
    col: 2,
    healthScore: 0.4,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 25.0,
      humidity: 71,
      light: 770,
      soilPH: 6.2,
    },
  },
  {
    id: "B4",
    name: "B4 区",
    row: 1,
    col: 3,
    healthScore: 0.2,
    lastUpdated: "2025-11-15T10:00:00Z",
    latestMetric: {
      timestamp: "2025-11-15T10:00:00Z",
      temperature: 24.5,
      humidity: 74,
      light: 730,
      soilPH: 6.0,
    },
  },
];

// 模拟从服务器获取田块状态列表
export async function fetchFieldStatuses(): Promise<FieldStatus[]> {
  // 这里先用 setTimeout 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_FIELDS;
}

/*
将来你们接后端接口时，可以改成类似这样：

export async function fetchFieldStatuses(): Promise<FieldStatus[]> {
  const res = await fetch("https://your-api.example.com/fields/status");
  if (!res.ok) {
    throw new Error("Failed to fetch field status");
  }
  const data = await res.json();
  return data as FieldStatus[];
}
*/

// 基础模板历史数据，用来生成不同田块的假数据
const BASE_HISTORY: FieldHistoryPoint[] = [
  { label: "4月", yield: 2200, growthIndex: 20 },
  { label: "5月", yield: 2600, growthIndex: 40 },
  { label: "6月", yield: 3100, growthIndex: 60 },
  { label: "7月", yield: 3400, growthIndex: 75 },
  { label: "8月", yield: 3600, growthIndex: 90 },
  { label: "9月", yield: 3800, growthIndex: 100 },
];

// 根据田块 id 生成略有差异的假历史数据
export async function fetchFieldHistory(
  fieldId: string
): Promise<FieldHistoryPoint[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 简单根据 id 做一点点区分
  const factor =
    fieldId === "A1"
      ? 1
      : fieldId === "A2"
      ? 0.95
      : fieldId === "A3"
      ? 0.9
      : fieldId === "B1"
      ? 1.05
      : fieldId === "B2"
      ? 1.0
      : 0.92;

  return BASE_HISTORY.map((p, index) => ({
    label: p.label,
    yield: Math.round(p.yield * factor + index * 40),
    growthIndex: Math.min(
      100,
      Math.max(0, Math.round(p.growthIndex * factor + (factor - 1) * 15))
    ),
  }));
}
