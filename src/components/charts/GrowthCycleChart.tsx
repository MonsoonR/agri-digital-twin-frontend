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
  if (!data.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[10px] text-lime-200/70">
        {loading ? "载入中…" : "暂无历史数据"}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bef264" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="#14532d"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke="#bbf7d0"
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: "#14532d" }}
          />
          <YAxis
            stroke="#bbf7d0"
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: "#14532d" }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #4ade80",
              borderRadius: 8,
              fontSize: 10,
            }}
            labelStyle={{ color: "#a7f3d0" }}
            formatter={(value: any) => [`${value}%`, "生长进度"]}
          />
          <Area
            type="monotone"
            dataKey="growthIndex"
            stroke="#bef264"
            strokeWidth={2}
            fill="url(#growthGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
