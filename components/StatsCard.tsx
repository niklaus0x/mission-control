interface StatsCardProps { title: string; value: number | string; icon?: React.ReactNode; trend?: { value: number; isPositive: boolean; }; }

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mono">{title}</p>{icon && <div className="text-zinc-600">{icon}</div>}</div>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-zinc-100 mono">{value}</p>
        {trend && <span className={`text-sm font-semibold mono ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{trend.isPositive ? '↑' : '↓'} {trend.value}%</span>}
      </div>
    </div>
  );
}