// src/api/field.ts
import type { FieldStatus, FieldHistoryPoint } from "../types/field";
import { get } from "../config/api";

/**
 * 获取所有田块的当前状态
 * @returns Promise<FieldStatus[]>
 */
export async function fetchFieldStatuses(): Promise<FieldStatus[]> {
  try {
    const data = await get<FieldStatus[]>("/fields/status");
    return data;
  } catch (error: any) {
    // 如果API调用失败，抛出错误让上层处理
    throw new Error(`获取田块状态失败: ${error?.message || '未知错误'}`);
  }
}

/**
 * 获取指定田块的历史数据
 * @param fieldId 田块ID
 * @returns Promise<FieldHistoryPoint[]>
 */
export async function fetchFieldHistory(
  fieldId: string
): Promise<FieldHistoryPoint[]> {
  try {
    const data = await get<FieldHistoryPoint[]>(`/fields/${fieldId}/history`);
    return data;
  } catch (error: any) {
    throw new Error(`获取田块历史数据失败: ${error?.message || '未知错误'}`);
  }
}

/**
 * 获取单个田块的详细信息
 * @param fieldId 田块ID
 * @returns Promise<FieldStatus>
 */
export async function fetchFieldDetail(fieldId: string): Promise<FieldStatus> {
  try {
    const data = await get<FieldStatus>(`/fields/${fieldId}`);
    return data;
  } catch (error: any) {
    throw new Error(`获取田块详情失败: ${error?.message || '未知错误'}`);
  }
}

// ========== 以下为假数据（仅用于开发和测试，生产环境应移除） ==========
// 如需在开发时使用假数据，可以取消注释下面的代码，并修改 fetchFieldStatuses 和 fetchFieldHistory

/*
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

const MOCK_FIELDS: FieldStatus[] = [
  {
    id: "A1",
    name: "A1 区",
    row: 0,
    col: 0,
    healthScore: 0.9,
    growthStage: "孕穗期",
    lastUpdated: now,
    latestMetric: makeMetric(26.1, 78, 880, 6.2),
  },
  // ... 其他假数据
];

const BASE_HISTORY: FieldHistoryPoint[] = [
  { label: "4月", yield: 2200, growthIndex: 20 },
  { label: "5月", yield: 2600, growthIndex: 40 },
  // ... 其他历史数据
];
*/
