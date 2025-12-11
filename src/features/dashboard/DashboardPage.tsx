// src/features/dashboard/DashboardPage.tsx
// 基于最新 Excel 数据的数字孪生大屏

import { useEffect, useState } from "react";
import SceneCanvas from "../scene/SceneCanvas";
import StatCard from "../../components/stats/StatCard";
import { useFieldStore } from "../../store/fieldStore";
import LightingControlPanel from "../../components/devices/LightingControlPanel";
import YieldTrendChart from "../../components/charts/YieldTrendChart";
import GrowthCycleChart from "../../components/charts/GrowthCycleChart";
import VegetationIndexChart from "../../components/charts/VegetationIndexChart";
import { useTheme } from "../../store/themeStore";

type LeftMetricItem = {
  label: string;
  icon: string;
  value: string;
  desc: string;
  available?: boolean;
};

function formatValue(v?: number, unit = "", digits = 1) {
  if (v === undefined || v === null || Number.isNaN(v)) return "--";
  return `${v.toFixed(digits)}${unit}`;
}

function LeftMetricCard({ item }: { item: LeftMetricItem }) {
  const { isDark } = useTheme();
  
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all hover:shadow-md
      ${isDark 
        ? "border-lime-400/20 bg-slate-950/90 hover:border-lime-400/30" 
        : "border-lime-600/20 bg-white/95 hover:border-lime-600/40 shadow-sm"}`}
    >
      <div
        className={`h-9 w-9 flex items-center justify-center rounded-lg text-lg flex-shrink-0 transition-colors
        ${isDark ? "bg-lime-400/15" : "bg-lime-50"}`}
      >
        {item.icon}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-medium truncate ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
          >
            {item.label}
          </span>
          <span
            className={`text-sm font-bold whitespace-nowrap
            ${item.available === false 
              ? (isDark ? "text-gray-500" : "text-gray-400")
              : (isDark ? "text-lime-50" : "text-gray-900")}`}
          >
            {item.value}
          </span>
        </div>
        <span
          className={`text-[10px] leading-snug mt-0.5
          ${isDark ? "text-lime-200/60" : "text-gray-500"}`}
        >
          {item.desc}
        </span>
      </div>
    </div>
  );
}

function BottomStatusBar({ selected }: { selected: any }) {
  const { isDark } = useTheme();
  const metrics = selected?.latestMetric;
  const healthScore = selected?.healthScore || 0;
  
  const items = [
    {
      label: "长势指数",
      value: `${Math.round(healthScore * 100)}%`,
      progress: healthScore,
      color: "lime",
    },
    {
      label: "成熟期预测",
      value: metrics?.maturity ? `${Math.round(metrics.maturity)}%` : "监测中",
      progress: metrics?.maturity ? Math.min(metrics.maturity / 100, 1) : 0.5,
      color: "yellow",
    },
    {
      label: "叶绿素",
      value: formatValue(metrics?.chlorophyll, ""),
      progress: metrics?.chlorophyll
        ? Math.min(metrics.chlorophyll / 40, 1)
        : 0.5,
      color: "lime",
    },
    {
      label: "叶面积指数",
      value: formatValue(metrics?.lai, "", 2),
      progress: metrics?.lai ? Math.min(metrics.lai / 4.5, 1) : 0.5,
      color: "lime",
    },
    {
      label: "株高",
      value: metrics?.plantHeight
        ? `${Math.round(metrics.plantHeight)} cm`
        : "监测中",
      progress: metrics?.plantHeight
        ? Math.min(metrics.plantHeight / 130, 1)
        : 0.5,
      color: "lime",
    },
    {
      label: "土壤 pH",
      value: formatValue(metrics?.soilPH, "", 2),
      progress:
        metrics?.soilPH !== undefined
          ? 1 - Math.abs((metrics.soilPH ?? 6.5) - 6.5) / 2
          : 0.5,
      color: metrics?.soilPH && metrics.soilPH >= 6 && metrics.soilPH <= 7 ? "lime" : "yellow",
    },
  ];

  return (
    <section
      className={`mt-3 rounded-xl border px-4 py-3 flex flex-col gap-3 transition-colors
      ${isDark ? "border-lime-400/30 bg-slate-950/95" : "border-lime-600/20 bg-white shadow-md"}`}
    >
      <div
        className={`flex items-center justify-between text-xs font-medium
        ${isDark ? "text-lime-100/90" : "text-gray-700"}`}
      >
        <span>作物全周期监测</span>
        <span className={`text-[10px] ${isDark ? "text-lime-200/70" : "text-gray-500"}`}>
          基于最新 Excel 数据
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div
              className={`flex items-center justify-between text-[10px]
              ${isDark ? "text-lime-100/80" : "text-gray-600"}`}
            >
              <span className="truncate">{item.label}</span>
              <span className={`font-semibold whitespace-nowrap ml-1 ${
                item.color === "red" ? "text-red-400" : 
                item.color === "yellow" ? "text-yellow-400" : 
                isDark ? "text-lime-300" : "text-lime-600"
              }`}>
                {item.value}
              </span>
            </div>
            <div
              className={`h-1.5 rounded-full overflow-hidden
              ${isDark ? "bg-slate-800" : "bg-gray-200"}`}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  item.color === "red"
                    ? "bg-gradient-to-r from-red-400 to-red-500"
                    : item.color === "yellow"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : isDark
                    ? "bg-gradient-to-r from-lime-400 to-lime-500"
                    : "bg-gradient-to-r from-lime-500 to-lime-600"
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
  const {
    getSelectedField,
    history,
    historyLoading,
    metricSeries,
    metricLoading,
    loadFieldMetrics,
  } = useFieldStore();
  const { isDark } = useTheme();
  const selected = getSelectedField();
  const metrics = selected?.latestMetric;

  const [view, setView] = useState<"overview" | "analysis" | "map">("overview");
  const selectedName = selected?.name ?? "未选择田块";

  // 加载关键指标序列（带缓存）
  useEffect(() => {
    if (selected?.id) {
      loadFieldMetrics(selected.id);
    }
  }, [selected?.id, loadFieldMetrics]);

  // 顶部四个关键指标
  const stats = [
    {
      label: "长势指数",
      value: metrics?.growthIndex
        ? Math.round((metrics.growthIndex || 0) * 100).toString()
        : "--",
      unit: "%",
      subLabel: "作物综合长势",
      accent: "amber" as const,
    },
    {
      label: "成熟期预测",
      value: metrics?.maturity ? Math.round(metrics.maturity).toString() : "--",
      unit: "%",
      subLabel: "成熟进度估计",
      accent: "yellow" as const,
    },
    {
      label: "叶绿素",
      value: metrics?.chlorophyll ? metrics.chlorophyll.toFixed(1) : "--",
      unit: "",
      subLabel: "叶片养分水平",
      accent: "green" as const,
    },
    {
      label: "株高",
      value: metrics?.plantHeight ? Math.round(metrics.plantHeight).toString() : "--",
      unit: "cm",
      subLabel: "冠层高度",
      accent: "blue" as const,
    },
  ];

  // 左侧详细指标列表
  const leftMetrics: LeftMetricItem[] = [
    {
      label: "长势指数",
      icon: "🌱",
      value: metrics?.growthIndex
        ? `${Math.round((metrics.growthIndex || 0) * 100)} %`
        : "--",
      desc: "综合生长状况",
      available: !!metrics?.growthIndex,
    },
    {
      label: "成熟期预测",
      icon: "📅",
      value: metrics?.maturity ? `${Math.round(metrics.maturity)} %` : "--",
      desc: "成熟进度估计",
      available: !!metrics?.maturity,
    },
    {
      label: "叶绿素",
      icon: "🍃",
      value: formatValue(metrics?.chlorophyll),
      desc: "养分水平",
      available: !!metrics?.chlorophyll,
    },
    {
      label: "叶面积指数",
      icon: "📈",
      value: formatValue(metrics?.lai, "", 2),
      desc: "冠层覆盖度",
      available: !!metrics?.lai,
    },
    {
      label: "株高",
      icon: "📏",
      value: metrics?.plantHeight
        ? `${Math.round(metrics.plantHeight)} cm`
        : "--",
      desc: "植株高度",
      available: !!metrics?.plantHeight,
    },
    {
      label: "土壤 pH",
      icon: "🧪",
      value: formatValue(metrics?.soilPH, "", 2),
      desc: "酸碱度",
      available: !!metrics?.soilPH,
    },
    {
      label: "可溶性盐分",
      icon: "🧂",
      value: formatValue(metrics?.salinity, " g/L", 2),
      desc: "盐分水平",
      available: !!metrics?.salinity,
    },
    {
      label: "有机质",
      icon: "🟤",
      value: formatValue(metrics?.organicMatter, " g/kg", 2),
      desc: "土壤有机质",
      available: !!metrics?.organicMatter,
    },
    {
      label: "氮素",
      icon: "💧",
      value: formatValue(metrics?.nitrogen, " mg/kg", 1),
      desc: "氮素含量",
      available: !!metrics?.nitrogen,
    },
    {
      label: "磷素",
      icon: "⚡",
      value: formatValue(metrics?.phosphorus, " mg/kg", 1),
      desc: "磷素含量",
      available: !!metrics?.phosphorus,
    },
    {
      label: "钾素",
      icon: "🧲",
      value: formatValue(metrics?.potassium, " mg/kg", 1),
      desc: "钾素含量",
      available: !!metrics?.potassium,
    },
  ];

  // 历史数据
  const MAX_POINTS = 200;
  const slicedHistory =
    history.length > MAX_POINTS ? history.slice(-MAX_POINTS) : history;
  const yieldData = slicedHistory.map((p) => ({
    label: p.label,
    yield: p.yield,
  }));
  const growthData = slicedHistory.map((p) => ({
    label: p.label,
    growthIndex: p.growthIndex,
  }));

  const renderOverview = () => (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1.7fr_420px] 2xl:grid-cols-[330px_1.9fr_440px] gap-4">
      {/* 左侧栏 - 环境指标 */}
      <section className="flex flex-col gap-3 min-h-0">
        {/* 当前田块信息卡片 */}
        <div
          className={`rounded-xl border px-4 py-4 flex flex-col gap-3 transition-colors flex-shrink-0
          ${isDark ? "border-lime-400/30 bg-slate-950/95" : "border-lime-600/20 bg-white shadow-md"}`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span
                className={`text-xs font-medium mb-1 ${isDark ? "text-lime-200/80" : "text-gray-500"}`}
              >
                当前监测田块
              </span>
              <span
                className={`text-base font-bold truncate ${isDark ? "text-lime-50" : "text-gray-900"}`}
              >
                {selectedName}
              </span>
            </div>
            {selected && (
              <div
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold border flex-shrink-0
                ${isDark 
                  ? "bg-lime-400/15 text-lime-100 border-lime-300/50" 
                  : "bg-lime-50 text-lime-800 border-lime-300"}`}
              >
                长势 {Math.round(selected.healthScore * 100)}%
              </div>
            )}
          </div>
          
          {/* 四个关键指标 */}
          <div className="grid grid-cols-2 gap-2.5">
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

        {/* 环境指标列表 */}
        <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
          {leftMetrics.map((item) => (
            <LeftMetricCard key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* 中间列：3D 场景，更大可视区 */}
      <section className="min-h-[560px] rounded-xl overflow-hidden">
        <SceneCanvas />
      </section>

      {/* 右侧栏 - 控制面板和图表 */}
      <section className="flex flex-col gap-3 min-h-0 overflow-hidden">
        {/* 控制/提示面板 */}
        <div className="flex-shrink-0">
          <LightingControlPanel
            fieldName={selected?.name}
            currentLight={metrics?.chlorophyll}
          />
        </div>

        {/* 关键指标图表 */}
        <div
          className={`rounded-xl border px-4 py-3 flex flex-col gap-2 flex-shrink-0 min-h-[220px]
          ${isDark ? "border-lime-400/30 bg-slate-950/90" : "border-lime-600/20 bg-white shadow-sm"}`}
        >
          <div
            className={`flex items-center justify-between text-xs font-semibold
            ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
          >
            <span>关键指标监测</span>
            <span className={`text-[10px] font-normal ${isDark ? "text-lime-300/80" : "text-lime-700"}`}>
              长势 / 叶绿素 / LAI / 株高
            </span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <VegetationIndexChart
              data={metricSeries}
              loading={metricLoading}
              indices={["growthIndex", "chlorophyll", "lai", "plantHeight"]}
            />
          </div>
        </div>

        {/* 产量趋势和生长周期 - 并排显示 */}
        <div className="flex-1 min-h-[300px] grid grid-cols-1 gap-3 overflow-hidden">
          {/* 产量趋势 */}
          <div
            className={`rounded-xl border px-4 py-3 flex flex-col gap-2 transition-colors
            ${isDark ? "border-lime-400/30 bg-slate-950/90" : "border-lime-600/20 bg-white shadow-sm"}`}
          >
            <div
              className={`flex items-center justify-between text-xs font-semibold
              ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
            >
              <span>产量/生产力指数</span>
              <span className={`text-[10px] font-normal ${isDark ? "text-lime-300/80" : "text-lime-700"}`}>
                最新 Excel 序列
              </span>
            </div>
            <div className="flex-1 min-h-[150px]">
              <YieldTrendChart data={yieldData} loading={historyLoading} />
            </div>
          </div>

          {/* 生长周期 */}
          <div
            className={`rounded-xl border px-4 py-3 flex flex-col gap-2 transition-colors
            ${isDark ? "border-lime-400/30 bg-slate-950/90" : "border-lime-600/20 bg-white shadow-sm"}`}
          >
            <div
              className={`flex items-center justify-between text-xs font-semibold
              ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
            >
              <span>生长进度</span>
              <span className={`text-[10px] font-normal ${isDark ? "text-lime-300/80" : "text-lime-700"}`}>
                长势指数 0-100%
              </span>
            </div>
            <div className="flex-1 min-h-[150px]">
              <GrowthCycleChart data={growthData} loading={historyLoading} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAnalysis = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-[640px]">
      <div
        className={`rounded-xl border px-4 py-3 flex flex-col gap-2 min-h-[320px]
        ${isDark ? "border-lime-400/30 bg-slate-950/95" : "border-lime-600/20 bg-white shadow-sm"}`}
      >
        <div
          className={`flex items-center justify-between text-xs font-semibold
          ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
        >
          <span>关键指标对比</span>
          <span className={`text-[10px] font-normal ${isDark ? "text-lime-300/80" : "text-lime-700"}`}>
            长势/叶绿素/LAI/株高
          </span>
        </div>
        <div className="flex-1 min-h-[260px]">
          <VegetationIndexChart
            data={metricSeries}
            loading={metricLoading}
            indices={["growthIndex", "chlorophyll", "lai", "plantHeight"]}
          />
        </div>
      </div>

      <div className="grid grid-rows-2 gap-4 min-h-[320px]">
        <div
          className={`rounded-xl border px-4 py-3 flex flex-col gap-2
          ${isDark ? "border-lime-400/30 bg-slate-950/95" : "border-lime-600/20 bg-white shadow-sm"}`}
        >
          <div
            className={`flex items-center justify-between text-xs font-semibold
            ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
          >
            <span>产量/生产力指数</span>
            <span className={`text-[10px] font-normal ${isDark ? "text-lime-300/80" : "text-lime-700"}`}>
              历史趋势
            </span>
          </div>
          <div className="flex-1 min-h-[150px]">
            <YieldTrendChart data={yieldData} loading={historyLoading} />
          </div>
        </div>

        <div
          className={`rounded-xl border px-4 py-3 flex flex-col gap-2
          ${isDark ? "border-lime-400/30 bg-slate-950/95" : "border-lime-600/20 bg-white shadow-sm"}`}
        >
          <div
            className={`flex items-center justify-between text-xs font-semibold
            ${isDark ? "text-lime-100/90" : "text-gray-800"}`}
          >
            <span>生长进度</span>
            <span className={`text-[10px] font-normal ${isDark ? "text-lime-300/80" : "text-lime-700"}`}>
              长势指数 0-100%
            </span>
          </div>
          <div className="flex-1 min-h-[150px]">
            <GrowthCycleChart data={growthData} loading={historyLoading} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="rounded-xl border min-h-[680px] overflow-hidden bg-white/80 dark:bg-slate-950/80">
      <SceneCanvas />
    </div>
  );

  return (
    <div className="flex flex-col gap-4 py-2 min-h-screen">
      <div className="flex items-center gap-2 text-sm">
        {[
          { key: "overview", label: "总览" },
          { key: "analysis", label: "分析" },
          { key: "map", label: "全屏场景" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setView(tab.key as any)}
            className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
              view === tab.key
                ? isDark
                  ? "bg-lime-400 text-slate-950 border-lime-300"
                  : "bg-lime-500 text-white border-lime-500 shadow"
                : isDark
                ? "border-slate-700 text-lime-100 bg-slate-900 hover:border-slate-600"
                : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "overview" && renderOverview()}
      {view === "analysis" && renderAnalysis()}
      {view === "map" && renderMap()}

      {/* 底部状态条 */}
      {view === "overview" && <BottomStatusBar selected={selected} />}
    </div>
  );
}
