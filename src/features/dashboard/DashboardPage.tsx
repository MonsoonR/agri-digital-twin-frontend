// src/features/dashboard/DashboardPage.tsx
import SceneCanvas from "../scene/SceneCanvas";
import StatCard from "../../components/stats/StatCard";
import { useFieldStore } from "../../store/fieldStore";
import LightingControlPanel from "../../components/devices/LightingControlPanel";
import YieldTrendChart from "../../components/charts/YieldTrendChart";
import GrowthCycleChart from "../../components/charts/GrowthCycleChart";
import { useTheme } from "../../store/themeStore";

type LeftMetricItem = {
  label: string;
  icon: string;
  value: string;
  desc: string;
};

function LeftMetricCard({ item }: { item: LeftMetricItem }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors
      ${isDark 
        ? 'border-lime-400/25 bg-slate-950/90' 
        : 'border-lime-600/30 bg-white/90 shadow-sm'}`}>
      <div className={`h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-full text-lg
        ${isDark ? 'bg-lime-400/20' : 'bg-lime-100'}`}>
        {item.icon}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-xs md:text-sm ${isDark ? 'text-lime-100/90' : 'text-gray-800'}`}>
            {item.label}
          </span>
          <span className={`text-xs md:text-sm font-semibold whitespace-nowrap
            ${isDark ? 'text-lime-50' : 'text-gray-900'}`}>
            {item.value}
          </span>
        </div>
        <span className={`text-[10px] md:text-[11px] leading-snug
          ${isDark ? 'text-lime-200/70' : 'text-gray-600'}`}>
          {item.desc}
        </span>
      </div>
    </div>
  );
}

function BottomStatusBar() {
  const { isDark } = useTheme();
  
  const items = [
    { label: "作物生长状态", value: "良好", progress: 0.72 },
    { label: "土壤质量", value: "偏酸", progress: 0.45 },
    { label: "施肥情况", value: "适中", progress: 0.6 },
    { label: "灌溉状态", value: "正常", progress: 0.8 },
    { label: "病虫害监测", value: "安全", progress: 0.9 },
    { label: "收获预测", value: "+320kg", progress: 0.65 },
  ];

  return (
    <section className={`mt-2 rounded-2xl border px-3 md:px-4 py-3 flex flex-col gap-2 transition-colors
      ${isDark 
        ? 'border-lime-400/40 bg-slate-950/95' 
        : 'border-lime-600/30 bg-white shadow-md'}`}>
      <div className={`flex flex-wrap items-center justify-between gap-1 text-[10px] md:text-xs
        ${isDark ? 'text-lime-100/80' : 'text-gray-700'}`}>
        <span>作物生长全周期监控</span>
        <span>示意指标 · 后续可接模型输出</span>
      </div>
      <div className="flex-1 flex items-center gap-2 overflow-x-auto">
        {items.map((item) => (
          <div key={item.label} className="min-w-[110px] flex-1">
            <div className={`flex items-center justify-between text-[10px] md:text-[11px] mb-1
              ${isDark ? 'text-lime-100/80' : 'text-gray-700'}`}>
              <span className="truncate max-w-[70%]">{item.label}</span>
              <span className="font-semibold whitespace-nowrap">
                {item.value}
              </span>
            </div>
            <div className={`h-[6px] rounded-full overflow-hidden
              ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full ${
                  isDark 
                    ? 'bg-gradient-to-r from-lime-300 via-lime-400 to-lime-500'
                    : 'bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600'
                }`}
                style={{ width: `${item.progress * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { getSelectedField, history, historyLoading } = useFieldStore();
  const { isDark } = useTheme();
  const selected = getSelectedField();
  const metrics = selected?.latestMetric;

  const selectedName = selected?.name ?? "未选择田块";

  const stats = metrics
    ? [
        {
          label: "温度",
          value: metrics.temperature.toFixed(1),
          unit: "°C",
          subLabel: "大田平均温度",
          accent: "amber" as const,
        },
        {
          label: "湿度",
          value: metrics.humidity.toFixed(0),
          unit: "%",
          subLabel: "空气相对湿度",
          accent: "blue" as const,
        },
        {
          label: "光照",
          value: metrics.light.toFixed(0),
          unit: "lx",
          subLabel: "当前光照强度",
          accent: "yellow" as const,
        },
        {
          label: "土壤 pH",
          value: metrics.soilPH.toFixed(1),
          unit: "",
          subLabel: "酸碱度接近 6 更佳",
          accent: "green" as const,
        },
      ]
    : [
        { label: "温度", value: "--", unit: "", subLabel: "", accent: "amber" as const },
        { label: "湿度", value: "--", unit: "", subLabel: "", accent: "blue" as const },
        { label: "光照", value: "--", unit: "", subLabel: "", accent: "yellow" as const },
        { label: "土壤 pH", value: "--", unit: "", subLabel: "", accent: "green" as const },
      ];

  const leftMetrics: LeftMetricItem[] = [
    {
      label: "温度",
      icon: "🌡️",
      value: metrics ? `${metrics.temperature.toFixed(1)} °C` : "--",
      desc: "当前大田平均温度",
    },
    {
      label: "湿度",
      icon: "💧",
      value: metrics ? `${metrics.humidity.toFixed(0)} %` : "--",
      desc: "空气相对湿度",
    },
    {
      label: "光照强度",
      icon: "☀️",
      value: metrics ? `${metrics.light.toFixed(0)} lx` : "--",
      desc: "实时光照水平",
    },
    {
      label: "土壤酸碱度",
      icon: "🧪",
      value: metrics ? metrics.soilPH.toFixed(1) : "--",
      desc: "土壤 pH 监测",
    },
    {
      label: "二氧化碳浓度",
      icon: "🌫️",
      value: "420 ppm",
      desc: "示意数据，可接 CO₂ 传感器",
    },
    {
      label: "风速",
      icon: "🌬️",
      value: "3.4 m/s",
      desc: "示意数据,可接气象站",
    },
  ];

  const mockAlerts = [
    { id: 1, time: "10:05", msg: "A1 区光照不足，已触发自动补光逻辑。" },
    { id: 2, time: "09:52", msg: "B3 区土壤湿度偏高，建议适度排水。" },
  ];

  const yieldData = history.map((p) => ({ label: p.label, yield: p.yield }));
  const growthData = history.map((p) => ({
    label: p.label,
    growthIndex: p.growthIndex,
  }));

  return (
    <div className="flex flex-col gap-3 py-1 md:py-2 lg:h-[calc(100vh-110px)]">
      {/* 上半部分：三列布局 - 改进间距和最小高度 */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_2.2fr_1fr] xl:grid-cols-[1.1fr_2.4fr_1.2fr] gap-3">
        
        {/* 左侧列 - 添加最大宽度限制 */}
        <section className="flex flex-col gap-3 min-h-0 max-w-full">
          {/* 当前田块 + 四个关键指标 */}
          <div className={`rounded-2xl border px-3 py-3 md:px-4 md:py-4 flex flex-col gap-2 transition-colors
            ${isDark 
              ? 'border-lime-400/40 bg-slate-950/95' 
              : 'border-lime-600/30 bg-white shadow-md'}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className={`text-[11px] md:text-xs
                  ${isDark ? 'text-lime-200/90' : 'text-gray-600'}`}>
                  当前监测田块
                </span>
                <span className={`text-sm md:text-base font-semibold
                  ${isDark ? 'text-lime-50' : 'text-gray-900'}`}>
                  {selectedName}
                </span>
              </div>
              {selected && (
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] md:text-xs border whitespace-nowrap
                  ${isDark 
                    ? 'bg-lime-400/15 text-lime-100 border-lime-300/60' 
                    : 'bg-lime-50 text-lime-800 border-lime-300'}`}>
                  长势指数 {Math.round(selected.healthScore * 100)}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {stats.map((s) => (
                <StatCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  unit={s.unit}
                  subLabel={s.subLabel}
                  accent={s.accent}
                />
              ))}
            </div>
          </div>

          {/* 环境指标列表 - 改进滚动区域 */}
          <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
            {leftMetrics.map((item) => (
              <LeftMetricCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        {/* 中间列：3D 场景 - 确保合适高度 */}
        <section className="min-h-[320px] lg:min-h-[400px]">
          <SceneCanvas />
        </section>

        {/* 右侧列 - 改进布局和间距 */}
        <section className="flex flex-col gap-3 min-h-0 max-w-full">
          {/* 光照控制面板 - 固定合理高度 */}
          <div className="h-auto lg:h-[240px] xl:h-[260px]">
            <LightingControlPanel
              fieldName={selected?.name}
              currentLight={metrics?.light}
            />
          </div>

          {/* 图表区域 - 使用 flex-1 自动分配剩余空间 */}
          <div className="flex-1 min-h-0 grid grid-cols-1 gap-3">
            {/* 产量趋势图 */}
            <div className={`rounded-xl border px-3 py-2 flex flex-col gap-1 min-h-[160px] transition-colors
              ${isDark 
                ? 'border-lime-400/30 bg-slate-950/90' 
                : 'border-lime-600/30 bg-white shadow-sm'}`}>
              <div className={`flex items-center justify-between gap-1 text-[11px] md:text-xs
                ${isDark ? 'text-lime-100/90' : 'text-gray-800'}`}>
                <span>产量趋势（示意）</span>
                <span className={`whitespace-nowrap ${isDark ? 'text-lime-300' : 'text-lime-700'}`}>
                  选中田块的历史变化
                </span>
              </div>
              <div className="mt-1 flex-1 min-h-[120px]">
                <YieldTrendChart data={yieldData} loading={historyLoading} />
              </div>
            </div>

            {/* 生长周期图 */}
            <div className={`rounded-xl border px-3 py-2 flex flex-col gap-1 min-h-[160px] transition-colors
              ${isDark 
                ? 'border-lime-400/30 bg-slate-950/90' 
                : 'border-lime-600/30 bg-white shadow-sm'}`}>
              <div className={`flex items-center justify-between gap-1 text-[11px] md:text-xs
                ${isDark ? 'text-lime-100/90' : 'text-gray-800'}`}>
                <span>作物生长周期（示意）</span>
                <span className={`whitespace-nowrap ${isDark ? 'text-lime-300' : 'text-lime-700'}`}>
                  生长进度 0-100%
                </span>
              </div>
              <div className="mt-1 flex-1 min-h-[120px]">
                <GrowthCycleChart
                  data={growthData}
                  loading={historyLoading}
                />
              </div>
            </div>
          </div>

          {/* 告警列表 - 固定高度，避免挤压 */}
          <div className={`rounded-xl border p-3 flex flex-col gap-2 transition-colors
            ${isDark 
              ? 'border-lime-400/30 bg-slate-950/95' 
              : 'border-lime-600/30 bg-white shadow-sm'}`}>
            <div className="flex items-center justify-between gap-1">
              <h2 className={`text-sm font-semibold ${isDark ? 'text-lime-100' : 'text-gray-900'}`}>
                实时告警
              </h2>
              <span className={`text-[10px] whitespace-nowrap
                ${isDark ? 'text-lime-200/80' : 'text-gray-600'}`}>
                最近 {mockAlerts.length} 条（示例）
              </span>
            </div>
            <ul className="space-y-1 max-h-32 overflow-y-auto text-[11px] md:text-xs scrollbar-thin">
              {mockAlerts.map((a) => (
                <li
                  key={a.id}
                  className={`border rounded-lg px-2 py-2 transition-colors
                    ${isDark 
                      ? 'border-lime-400/40 bg-slate-950/90' 
                      : 'border-lime-300 bg-lime-50/50'}`}
                >
                  <div className="flex justify-between mb-1 gap-1">
                    <span className={`font-medium ${isDark ? 'text-lime-100' : 'text-gray-900'}`}>
                      {a.time}
                    </span>
                    <span className={`text-[10px] whitespace-nowrap
                      ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                      光照 / 环境
                    </span>
                  </div>
                  <p className={`leading-snug ${isDark ? 'text-lime-100/90' : 'text-gray-700'}`}>
                    {a.msg}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* 下方横向状态条 */}
      <BottomStatusBar />
    </div>
  );
}