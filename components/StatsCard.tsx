interface StatsCardProps { title: string; value: number | string; icon?: React.ReactNode; trend?: { value: number; isPositive: boolean; }; }

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>{trend.isPositive ? '↑' : '↓'} {trend.value}%</span>}
      </div>
    </div>
  );
}