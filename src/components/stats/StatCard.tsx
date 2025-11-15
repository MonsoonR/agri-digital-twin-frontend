interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  subLabel,
}: StatCardProps) {
  return (
    <div className="bg-slate-800/80 rounded-lg px-3 py-2 md:px-4 md:py-3 flex flex-col gap-1">
      <span className="text-xs md:text-sm text-slate-400">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl md:text-2xl font-semibold">{value}</span>
        {unit && (
          <span className="text-xs md:text-sm text-slate-400">{unit}</span>
        )}
      </div>
      {subLabel && (
        <span className="text-[10px] md:text-xs text-slate-500">
          {subLabel}
        </span>
      )}
    </div>
  );
}
