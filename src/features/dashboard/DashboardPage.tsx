import SceneCanvas from "../scene/SceneCanvas";
import StatCard from "../../components/stats/StatCard";

export default function DashboardPage() {
  // 后面这些数据会改成从 API 拉，这里先写死假数据
  const mockStats = [
    { label: "平均温度", value: 26.3, unit: "°C", subLabel: "过去1小时" },
    { label: "平均湿度", value: 68, unit: "%", subLabel: "过去1小时" },
    { label: "平均光照", value: 820, unit: "lx", subLabel: "当前" },
    { label: "土壤 pH", value: 6.4, unit: "", subLabel: "适宜范围 5.5-6.5" },
  ];

  const mockAlerts = [
    { id: 1, time: "10:05", msg: "A区光照不足，已自动开启补光灯" },
    { id: 2, time: "09:52", msg: "C区土壤湿度偏高，请注意排水" },
  ];

  return (
    <>
      {/* 左侧：指标 + 控制按钮（md 以上占宽度 1/4） */}
      <section className="w-full md:w-1/4 h-1/3 md:h-full flex flex-col gap-2">
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

        {/* 预留控制区域，将来放按钮/开关 */}
        <div className="flex-1 bg-slate-800/80 rounded-lg p-3 mt-2">
          <h2 className="text-sm font-semibold mb-2">设备控制（预留）</h2>
          <p className="text-xs text-slate-400">
            将来在这里放补光灯、水泵等设备的开关和策略设置。
          </p>
        </div>
      </section>

      {/* 中间：3D 场景（md 以上占宽度 2/4） */}
      <section className="w-full md:w-2/4 h-1/3 md:h-full">
        <SceneCanvas />
      </section>

      {/* 右侧：告警/日志（md 以上占宽度 1/4） */}
      <section className="w-full md:w-1/4 h-1/3 md:h-full flex flex-col gap-2">
        <div className="flex-1 bg-slate-800/80 rounded-lg p-3">
          <h2 className="text-sm font-semibold mb-2">实时告警</h2>
          <ul className="space-y-1 max-h-full overflow-y-auto text-xs md:text-sm">
            {mockAlerts.map((a) => (
              <li
                key={a.id}
                className="border border-slate-700 rounded px-2 py-1"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{a.time}</span>
                </div>
                <p className="text-slate-300">{a.msg}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
