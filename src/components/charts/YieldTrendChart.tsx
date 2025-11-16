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

type YieldPoint = {
  label: string;
  yield: number;
};

interface YieldTrendChartProps {
  data: YieldPoint[];
  loading?: boolean;
}

export default function YieldTrendChart({ data, loading }: YieldTrendChartProps) {
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
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #4ade80",
              borderRadius: 8,
              fontSize: 10,
            }}
            labelStyle={{ color: "#a7f3d0" }}
          />
          <Line
            type="monotone"
            dataKey="yield"
            stroke="#bef264"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#bef264", strokeWidth: 1, fill: "#0f172a" }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
