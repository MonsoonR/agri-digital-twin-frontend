// src/components/devices/LightingControlPanel.tsx
import { useFieldStore } from "../../store/fieldStore";

interface LightingControlPanelProps {
  fieldName?: string;
  currentLight?: number;
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

  const autoMode = lightingMode === "auto";

  // 统一的补光开启逻辑
  const supplementOn = autoMode
    ? currentLight !== undefined
      ? currentLight < lightThreshold
      : false
    : manualLightOn;

  const lightText =
    currentLight !== undefined ? `${currentLight.toFixed(0)} lx` : "--";

  return (
    <div className="h-full rounded-2xl border border-lime-400/40 bg-slate-950/95 p-3 md:p-4 flex flex-col gap-3">
      {/* 标题 + 当前田块 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-full bg-lime-400/20 text-lg">
            ☀️
          </div>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-semibold text-lime-100">
              光照控制
            </span>
            <span className="text-[10px] md:text-xs text-lime-200/80 leading-snug">
              根据光照强度自动开启补光灯，可切换为手动控制。
            </span>
          </div>
        </div>
        <span className="rounded-full border border-lime-400/40 bg-lime-400/10 px-2 py-1 text-[10px] md:text-xs text-lime-100 whitespace-nowrap">
          {fieldName ?? "未选择田块"}
        </span>
      </div>

      {/* 当前光照 + 灯状态 */}
      <div className="rounded-xl border border-lime-400/30 bg-slate-950/90 px-3 py-2 flex items-center justify-between text-[11px] md:text-xs">
        <div className="flex flex-col">
          <span className="text-lime-200/80">当前光照</span>
          <span className="text-sm md:text-base font-semibold text-lime-50">
            {lightText}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lime-200/80">补光灯状态</span>
          <span
            className={`text-xs font-semibold ${
              supplementOn ? "text-emerald-300" : "text-lime-300/80"
            }`}
          >
            {supplementOn ? "ON（已开启）" : "OFF（关闭）"}
          </span>
        </div>
      </div>

      {/* 模式按钮 */}
      <div className="flex items-center gap-2 text-[11px] md:text-xs">
        <button
          type="button"
          onClick={() => setLightingMode("auto")}
          className={`flex-1 rounded-full border px-3 py-1 ${
            autoMode
              ? "border-lime-400 bg-lime-400/15 text-lime-100"
              : "border-slate-700 bg-slate-950 text-lime-200/80"
          }`}
        >
          自动模式
        </button>
        <button
          type="button"
          onClick={() => setLightingMode("manual")}
          className={`flex-1 rounded-full border px-3 py-1 ${
            !autoMode
              ? "border-lime-400 bg-lime-400/15 text-lime-100"
              : "border-slate-700 bg-slate-950 text-lime-200/80"
          }`}
        >
          手动模式
        </button>
      </div>

      {/* 自动模式说明 / 手动开关 */}
      {autoMode ? (
        <div className="rounded-xl border border-lime-400/25 bg-slate-950/95 px-3 py-2 text-[11px] md:text-xs text-lime-200/80 leading-snug">
          <div className="flex items-center justify-between mb-1">
            <span>示例阈值策略</span>
            <span className="text-lime-300 whitespace-nowrap">
              {lightThreshold} lx 自动补光
            </span>
          </div>
          <p className="break-words">
            当监测光照低于{" "}
            <span className="text-lime-300 font-medium">
              {lightThreshold} lx
            </span>{" "}
            时自动开启补光灯；当光照恢复高于阈值一定幅度后自动关闭。
            阈值和控制逻辑可与真实物联网设备参数联动。
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-lime-400/25 bg-slate-950/95 px-3 py-2 text-[11px] md:text-xs text-lime-200/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span>手动控制补光灯</span>
            <span className="text-[10px] text-lime-200/70">
              适用于现场调试或特殊天气场景。
            </span>
          </div>
          <button
            type="button"
            onClick={() => setManualLightOn(!manualLightOn)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
              manualLightOn ? "bg-emerald-400" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-slate-950 transition ${
                manualLightOn ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
