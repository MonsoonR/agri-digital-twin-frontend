import SceneCanvas from "../scene/SceneCanvas";
import StatCard from "../../components/stats/StatCard";
import { useFieldStore } from "../../store/fieldStore";

export default function DashboardPage() {
  const { getSelectedField } = useFieldStore();
  const selected = getSelectedField();

  const metrics = selected?.latestMetric;

  const mockStats = metrics
    ? [
        {
          label: "温度",
          value: metrics.temperature,
          unit: "°C",
          subLabel: "当前",
        },
        {
          label: "湿度",
          value: metrics.humidity,
          unit: "%",
          subLabel: "当前",
        },
        {
          label: "光照",
          value: metrics.light,
          unit: "lx",
          subLabel: "当前",
        },
        {
          label: "土壤 pH",
          value: metrics.soilPH,
          unit: "",
          subLabel: "适宜范围 5.5-6.5",
        },
      ]
    : [
        // 还没加载出来时的占位
        { label: "温度", value: "--", unit: "", subLabel: "" },
        { label: "湿度", value: "--", unit: "", subLabel: "" },
        { label: "光照", value: "--", unit: "", subLabel: "" },
        { label: "土壤 pH", value: "--", unit: "", subLabel: "" },
      ];

  const selectedName = selected?.name ?? "未选择田块";

  return (
    <>
      {/* 左侧：指标 + 控制按钮 */}
      <section className="w-full md:w-1/4 h-1/3 md:h-full flex flex-col gap-2">
        <div className="bg-slate-800/80 rounded-lg px-3 py-2 md:px-4 md:py-3">
          <div className="text-xs md:text-sm text-slate-400 mb-1">
            当前田块
          </div>
          <div className="text-sm md:text-base font-semibold">
            {selectedName}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mockStats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              unit={s.unit}
              subLabel={s.subLabel}
            />
          ))}
        </div>

        <div className="flex-1 bg-slate-800/80 rounded-lg p-3 mt-2">
          <h2 className="text-sm font-semibold mb-2">设备控制（预留）</h2>
          <p className="text-xs text-slate-400">
            将来在这里放补光灯、水泵等设备的开关和策略设置。
          </p>
        </div>
      </section>

      {/* 中间 + 右侧保持你之前的写法即可 */}
      <section className="w-full md:w-2/4 h-1/3 md:h-full">
        <SceneCanvas />
      </section>

      {/* 右侧告警保持不变或稍微改名 */}
      {/* ... */}
    </>
  );
}
