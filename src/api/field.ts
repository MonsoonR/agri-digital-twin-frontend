// src/api/field.ts
// 基于最新 Excel 数据的田块 API 封装

import type {
  FieldStatus,
  FieldHistoryPoint,
  MetricHistoryPoint,
} from "../types/field";
import { get } from "../config/api";

/**
 * 获取所有田块的当前状态列表
 * GET /fields/status
 */
export async function fetchFieldStatuses(): Promise<FieldStatus[]> {
  try {
    const data = await get<FieldStatus[]>("/fields/status");
    return data;
  } catch (error: any) {
    throw new Error(`获取田块状态失败: ${error?.message || "未知错误"}`);
  }
}

/**
 * 获取指定田块的历史趋势（产量指数 & 生长进度等）
 * GET /fields/{fieldId}/history
 */
export async function fetchFieldHistory(
  fieldId: string
): Promise<FieldHistoryPoint[]> {
  try {
    const data = await get<FieldHistoryPoint[]>(
      `/fields/${encodeURIComponent(fieldId)}/history`
    );
    return data;
  } catch (error: any) {
    throw new Error(`获取田块历史数据失败: ${error?.message || "未知错误"}`);
  }
}

/**
 * 获取田块关键指标时间序列（用于折线图展示）
 * GET /fields/{fieldId}/metrics
 */
export async function fetchFieldMetricSeries(
  fieldId: string
): Promise<MetricHistoryPoint[]> {
  try {
    const data = await get<MetricHistoryPoint[]>(
      `/fields/${encodeURIComponent(fieldId)}/metrics`
    );
    return data;
  } catch (error: any) {
    throw new Error(`获取关键指标失败: ${error?.message || "未知错误"}`);
  }
}

/**
 * 获取单个田块详情
 * GET /fields/{fieldId}
 */
export async function fetchFieldDetail(
  fieldId: string
): Promise<FieldStatus> {
  try {
    const data = await get<FieldStatus>(
      `/fields/${encodeURIComponent(fieldId)}`
    );
    return data;
  } catch (error: any) {
    throw new Error(`获取田块详情失败: ${error?.message || "未知错误"}`);
  }
}
