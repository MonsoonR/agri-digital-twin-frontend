// src/components/devices/LightingControlPanel.tsx
// 田块运行状态与模拟控制面板

import { useFieldStore } from "../../store/fieldStore";
import { useTheme } from "../../store/themeStore";

interface LightingControlPanelProps {
  fieldName?: string;
  currentLight?: number; // 这里用作“参考指标”，兼容旧属性
}

export default function LightingControlPanel({
  fieldName,
  currentLight,
}: LightingControlPanelProps) {
  const {
    lightingMode,
    manualLightOn,
    lightThreshold,
    setLightingMode,
    setManualLightOn,
  } = useFieldStore();
  
  const { isDark } = useTheme();

  const autoMode = lightingMode === "auto";

  const supplementOn = autoMode
    ? currentLight !== undefined
      ? currentLight < lightThreshold
      : false
    : manualLightOn;

  return (
    <div className={`h-full rounded-2xl border p-3 md:p-4 flex flex-col gap-3 transition-colors overflow-hidden ${
      isDark 
        ? "border-lime-400/40 bg-slate-950/95" 
        : "border-lime-600/30 bg-white shadow-md"
    }`}>
      {/* 标题 + 当前田块 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-full text-lg ${
            isDark ? "bg-lime-400/20" : "bg-lime-100"
          }`}>
            🌾
          </div>
          <div className="flex flex-col">
            <span className={`text-xs md:text-sm font-semibold transition-colors ${
              isDark ? "text-lime-100" : "text-gray-900"
            }`}>
              田块运行状态
            </span>
            <span className={`text-[10px] md:text-xs leading-snug transition-colors ${
              isDark ? "text-lime-200/80" : "text-gray-600"
            }`}>
              基于最新 Excel 数据的模拟调控，支持自动/手动切换。
            </span>
          </div>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[10px] md:text-xs whitespace-nowrap transition-colors ${
          isDark 
            ? "border-lime-400/40 bg-lime-400/10 text-lime-100"
            : "border-lime-500 bg-lime-50 text-lime-700"
        }`}>
          {fieldName ?? "未选择田块"}
        </span>
      </div>

      {/* 参考指标 + 开关状态 */}
      <div className={`rounded-xl border px-3 py-2 flex items-center justify-between text-[11px] md:text-xs transition-colors ${
        isDark 
          ? "border-lime-400/30 bg-slate-950/90"
          : "border-lime-500/30 bg-lime-50/50"
      }`}>
        <div className="flex flex-col">
          <span className={`transition-colors ${isDark ? "text-lime-200/80" : "text-gray-600"}`}>
            关键指标参考
          </span>
          <span className={`text-sm md:text-base font-semibold transition-colors ${
            isDark ? "text-lime-50" : "text-gray-900"
          }`}>
            {currentLight !== undefined ? currentLight.toFixed(2) : "--"}
          </span>
          <span className={`text-[10px] ${isDark ? "text-lime-200/70" : "text-gray-500"}`}>
            例如叶绿素/长势指数
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`transition-colors ${isDark ? "text-lime-200/80" : "text-gray-600"}`}>
            模拟设备
          </span>
          <span
            className={`text-xs font-semibold ${
              supplementOn 
                ? isDark ? "text-emerald-300" : "text-emerald-600"
                : isDark ? "text-lime-300/80" : "text-gray-500"
            }`}
          >
            {supplementOn ? "ON（联动中）" : "OFF（待机）"}
          </span>
        </div>
      </div>

      {/* 模式按钮 */}
      <div className="flex items-center gap-2 text-[11px] md:text-xs">
        <button
          type="button"
          onClick={() => setLightingMode("auto")}
          className={`flex-1 rounded-full border px-3 py-1 transition-all ${
            autoMode
              ? isDark 
                ? "border-lime-400 bg-lime-400/15 text-lime-100"
                : "border-lime-500 bg-lime-500 text-white shadow-md"
              : isDark
              ? "border-slate-700 bg-slate-950 text-lime-200/80 hover:border-slate-600"
              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
          }`}
        >
          自动模拟
        </button>
        <button
          type="button"
          onClick={() => setLightingMode("manual")}
          className={`flex-1 rounded-full border px-3 py-1 transition-all ${
            !autoMode
              ? isDark 
                ? "border-lime-400 bg-lime-400/15 text-lime-100"
                : "border-lime-500 bg-lime-500 text-white shadow-md"
              : isDark
              ? "border-slate-700 bg-slate-950 text-lime-200/80 hover:border-slate-600"
              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
          }`}
        >
          手动调试
        </button>
      </div>

      {/* 模式说明 / 手动开关 */}
      {autoMode ? (
        <div className={`rounded-xl border px-3 py-2 text-[10px] md:text-[11px] leading-relaxed transition-colors flex-shrink-0 ${
          isDark 
            ? "border-lime-400/25 bg-slate-950/95 text-lime-200/80"
            : "border-lime-500/25 bg-lime-50/50 text-gray-700"
        }`}>
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="font-medium">示例阈值策略</span>
            <span className={`whitespace-nowrap text-[10px] ${isDark ? "text-lime-300" : "text-lime-700 font-medium"}`}>
              指标低于 {lightThreshold} 触发联动
            </span>
          </div>
          <p className="break-words leading-snug">
            阈值与逻辑可按真实设备改写，目前用于演示：当关键指标（如长势/光谱）低于阈值时，视为需要补偿或调控。
          </p>
        </div>
      ) : (
        <div className={`rounded-xl border px-3 py-2 text-[11px] md:text-xs flex items-center justify-between transition-colors ${
          isDark 
            ? "border-lime-400/25 bg-slate-950/95 text-lime-200/80"
            : "border-lime-500/25 bg-lime-50/50 text-gray-700"
        }`}>
          <div className="flex flex-col">
            <span>手动开关</span>
            <span className={`text-[10px] ${isDark ? "text-lime-200/70" : "text-gray-500"}`}>
              现场调试或演示时手动控制。
            </span>
          </div>
          <button
            type="button"
            onClick={() => setManualLightOn(!manualLightOn)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
              manualLightOn 
                ? isDark ? "bg-emerald-400" : "bg-emerald-500"
                : isDark ? "bg-slate-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full transition ${
                isDark ? "bg-slate-950" : "bg-white"
              } ${manualLightOn ? "translate-x-3.5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
