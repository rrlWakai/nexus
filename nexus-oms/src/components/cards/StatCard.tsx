interface StatCardProps {
  icon: string
  iconBg: string
  iconColor: string
  label: string
  value: string | number
  trend?: { value: string; direction: 'up' | 'down' }
}

export default function StatCard({ icon, iconBg, iconColor, label, value, trend }: StatCardProps) {
  return (
    <div className="glass-card p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBg} ${iconColor} rounded-2xl`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <span className={`${trend.direction === 'up' ? 'text-success' : 'text-error'} text-label-sm font-semibold flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[14px]">
              {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{label}</h3>
      <p className="font-display-lg text-display-lg text-ink-primary">{value}</p>
    </div>
  )
}
