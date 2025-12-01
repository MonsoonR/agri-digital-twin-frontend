// src/components/charts/YieldTrendChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../store/themeStore";

type YieldPoint = {
  label: string;
  yield: number;
};

interface YieldTrendChartProps {
  data: YieldPoint[];
  loading?: boolean;
}

export default function YieldTrendChart({ data, loading }: YieldTrendChartProps) {
  const { isDark } = useTheme();

  if (!data.length) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] ${
        isDark ? 'text-lime-200/70' : 'text-gray-600'
      }`}>
        {loading ? "载入中…" : "暂无历史数据"}
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
  const lineColor = isDark ? "#bef264" : "#22c55e";
  const dotFill = isDark ? "#0f172a" : "#ffffff";

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
            tick={{ fontSize: 10, fill: axisColor }}
            axisLine={{ stroke: axisLineColor }}
          />
          <YAxis
            stroke={axisColor}
            tick={{ fontSize: 10, fill: axisColor }}
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
          />
          <Line
            type="monotone"
            dataKey="yield"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 3, stroke: lineColor, strokeWidth: 1, fill: dotFill }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
