interface InsightCardProps {
  icon: string
  title: string
  description: string
  actions?: React.ReactNode
}

export default function InsightCard({ icon, title, description, actions }: InsightCardProps) {
  return (
    <div className="glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border-2 border-primary-container/20">
      <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/30 shrink-0">
        <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-headline-md text-headline-md text-ink-primary mb-2">{title}</h3>
        <p className="text-body-md text-on-surface-variant">{description}</p>
      </div>
      {actions && <div className="shrink-0 flex gap-3">{actions}</div>}
    </div>
  )
}
