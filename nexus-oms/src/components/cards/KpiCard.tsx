interface KpiCardProps {
  label: string
  value: string | number | React.ReactNode
  trend?: { value: string; direction: 'up' | 'down' }
  icon?: string
  iconColor?: string
  accentBorder?: boolean
  accentColor?: string
  children?: React.ReactNode
}

export default function KpiCard({ label, value, trend, icon, iconColor = "text-primary", accentBorder, accentColor = "border-l-warning", children }: KpiCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-5 flex flex-col justify-between ${accentBorder ? `border-l-4 ${accentColor}` : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">{label}</span>
        {trend && (
          <span className={`${trend.direction === 'up' ? 'text-success' : 'text-error'} font-semibold text-label-sm flex items-center gap-0.5`}>
            <span className="material-symbols-outlined text-[14px]">
              {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trend.value}
          </span>
        )}
        {!trend && icon && (
          <span className={`material-symbols-outlined ${iconColor} text-[20px]`}>{icon}</span>
        )}
      </div>
      <div className="font-headline-lg text-headline-lg">{value}</div>
      {children}
    </div>
  )
}
