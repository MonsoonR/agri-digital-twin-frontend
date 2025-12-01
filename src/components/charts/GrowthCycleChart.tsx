// src/components/charts/GrowthCycleChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../store/themeStore";

type GrowthPoint = {
  label: string;
  growthIndex: number;
};

interface GrowthCycleChartProps {
  data: GrowthPoint[];
  loading?: boolean;
}

export default function GrowthCycleChart({
  data,
  loading,
}: GrowthCycleChartProps) {
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
  const strokeColor = isDark ? "#bef264" : "#22c55e";
  const gradientStart = isDark ? "#bef264" : "#4ade80";
  const gradientEnd = isDark ? "#22c55e" : "#86efac";

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientStart} stopOpacity={0.9} />
              <stop offset="100%" stopColor={gradientEnd} stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 8,
              fontSize: 10,
            }}
            labelStyle={{ color: tooltipLabelColor }}
            formatter={(value: any) => [`${value}%`, "生长进度"]}
          />
          <Area
            type="monotone"
            dataKey="growthIndex"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#growthGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
