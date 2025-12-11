// src/components/charts/VegetationIndexChart.tsx
// 关键指标对比折线图（长势 / 叶绿素 / LAI / 株高）

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../store/themeStore";
import type { MetricHistoryPoint } from "../../types/field";

type MetricKey = "growthIndex" | "chlorophyll" | "lai" | "plantHeight";

interface VegetationIndexChartProps {
  data: MetricHistoryPoint[];
  loading?: boolean;
  indices?: MetricKey[];
}

export default function VegetationIndexChart({
  data,
  loading,
  indices = ["growthIndex", "chlorophyll", "lai", "plantHeight"],
}: VegetationIndexChartProps) {
  const { isDark } = useTheme();

  if (loading || !data.length) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center text-[10px] ${
          isDark ? "text-lime-200/70" : "text-gray-600"
        }`}
      >
        {loading ? "载入中..." : "暂无指标数据"}
      </div>
    );
  }

  // 根据主题设置颜色
  const gridColor = isDark ? "#14532d" : "#d1d5db";
  const axisColor = isDark ? "#bbf7d0" : "#374151";
  const axisLineColor = isDark ? "#14532d" : "#9ca3af";
  const tooltipBg = isDark ? "#020617" : "#ffffff";
  const tooltipBorder = isDark ? "#4ade80" : "#22c55e";
  const tooltipLabelColor = isDark ? "#a7f3d0" : "#166534";

  const indexConfig: Record<MetricKey, { name: string; color: string }> = {
    growthIndex: { name: "长势指数", color: isDark ? "#10b981" : "#059669" },
    chlorophyll: { name: "叶绿素", color: isDark ? "#fbbf24" : "#f59e0b" },
    lai: { name: "叶面积指数", color: isDark ? "#3b82f6" : "#2563eb" },
    plantHeight: { name: "株高", color: isDark ? "#06b6d4" : "#0891b2" },
  };

  // 过滤无效行
  const filteredData = data.filter((item) =>
    indices.some((idx) => item[idx as keyof MetricHistoryPoint] !== null && item[idx as keyof MetricHistoryPoint] !== undefined)
  );

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke={axisColor}
            tick={{ fontSize: 9, fill: axisColor }}
            axisLine={{ stroke: axisLineColor }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={axisColor}
            tick={{ fontSize: 9, fill: axisColor }}
            axisLine={{ stroke: axisLineColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 8,
              fontSize: 10,
            }}
            labelStyle={{ color: tooltipLabelColor }}
            formatter={(value: any, name: string) => {
              const formattedValue =
                value !== null && value !== undefined
                  ? Number(value).toFixed(2)
                  : "--";
              const pretty =
                indexConfig[name as MetricKey]?.name || name;
              return [formattedValue, pretty];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
            iconType="line"
          />
          {indices.map((idx) => {
            const config = indexConfig[idx];
            return (
              <Line
                key={idx}
                type="monotone"
                dataKey={idx}
                name={idx}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
