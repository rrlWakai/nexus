interface MlInsightCardProps {
  icon?: string
  title: string
  description: string
  children?: React.ReactNode
}

export default function MlInsightCard({ icon = "psychology", title, description, children }: MlInsightCardProps) {
  return (
    <div className="glass-card rounded-3xl p-8 ml-border overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          <h4 className="font-headline-md text-headline-md text-ink-primary">{title}</h4>
        </div>
        <p className="text-body-md text-ink-secondary mb-8 max-w-lg">{description}</p>
        {children}
      </div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px]" />
    </div>
  )
}
