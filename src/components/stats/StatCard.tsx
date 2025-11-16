// src/components/stats/StatCard.tsx

type Accent = "green" | "blue" | "yellow" | "amber" | "red";

// 这里虽然还叫这些名字，但都围绕荧光绿这一套做细微变化
const accentMap: Record<Accent, string> = {
  green: "from-lime-400 via-lime-300 to-lime-200",
  blue: "from-emerald-400 via-lime-300 to-emerald-200",
  yellow: "from-lime-300 via-yellow-200 to-lime-200",
  amber: "from-lime-400 via-lime-200 to-amber-200",
  red: "from-lime-400 via-emerald-300 to-emerald-200",
};

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string;
  accent?: Accent;
}

export default function StatCard({
  label,
  value,
  unit,
  subLabel,
  accent = "green",
}: StatCardProps) {
  const gradient = accentMap[accent] ?? accentMap.green;

  return (
    <div className="relative overflow-hidden rounded-xl border border-lime-400/35 bg-slate-950/90 px-3 py-2 md:px-4 md:py-3 flex flex-col gap-1">
      {/* 顶部细渐变条 */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradient}`}
      />
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] md:text-xs text-lime-100/80">
          {label}
        </span>
        {subLabel && (
          <span className="text-[9px] md:text-[10px] text-lime-200/70 text-right line-clamp-1">
            {subLabel}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg md:text-2xl font-semibold text-lime-50">
          {value}
        </span>
        {unit && (
          <span className="text-[10px] md:text-xs text-lime-200/80">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
