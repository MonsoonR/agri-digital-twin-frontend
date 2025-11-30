// src/components/stats/StatCard.tsx
import { useTheme } from "../../store/themeStore";

type Accent = "green" | "blue" | "yellow" | "amber" | "red";

const accentMapDark: Record<Accent, string> = {
  green: "from-lime-400 via-lime-300 to-lime-200",
  blue: "from-emerald-400 via-lime-300 to-emerald-200",
  yellow: "from-lime-300 via-yellow-200 to-lime-200",
  amber: "from-lime-400 via-lime-200 to-amber-200",
  red: "from-lime-400 via-emerald-300 to-emerald-200",
};

const accentMapLight: Record<Accent, string> = {
  green: "from-lime-500 via-green-400 to-emerald-400",
  blue: "from-cyan-500 via-blue-400 to-sky-400",
  yellow: "from-yellow-400 via-amber-300 to-orange-400",
  amber: "from-amber-500 via-yellow-400 to-orange-400",
  red: "from-red-400 via-rose-300 to-pink-400",
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
  const { isDark } = useTheme();
  const gradient = isDark 
    ? (accentMapDark[accent] ?? accentMapDark.green)
    : (accentMapLight[accent] ?? accentMapLight.green);

  return (
    <div className={`relative overflow-hidden rounded-xl border px-3 py-2 md:px-4 md:py-3 flex flex-col gap-1 transition-colors ${
      isDark 
        ? 'border-lime-400/35 bg-slate-950/90' 
        : 'border-lime-500/30 bg-white shadow-sm'
    }`}>
      {/* 顶部细渐变条 */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradient}`}
      />
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-[10px] md:text-xs transition-colors ${
          isDark ? 'text-lime-100/80' : 'text-gray-600'
        }`}>
          {label}
        </span>
        {subLabel && (
          <span className={`text-[9px] md:text-[10px] text-right line-clamp-1 transition-colors ${
            isDark ? 'text-lime-200/70' : 'text-gray-500'
          }`}>
            {subLabel}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg md:text-2xl font-semibold transition-colors ${
          isDark ? 'text-lime-50' : 'text-gray-900'
        }`}>
          {value}
        </span>
        {unit && (
          <span className={`text-[10px] md:text-xs transition-colors ${
            isDark ? 'text-lime-200/80' : 'text-gray-600'
          }`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}