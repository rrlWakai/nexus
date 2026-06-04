import PageHeader from '@/components/layout/PageHeader'
import KpiCard from '@/components/cards/KpiCard'
import InsightCard from '@/components/cards/InsightCard'
import { useDashboardStats } from '@/hooks/useDashboardStats'

export default function Dashboard() {
  const { stats, insights, loading } = useDashboardStats()

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Luminous Intelligence"
        subtitle="Real-time enterprise overview with AI-driven insights."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <KpiCard
          label="Total Revenue"
          value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          trend={{ value: `+${stats.revenueGrowth}%`, direction: 'up' }}
        />
        <KpiCard
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          trend={{ value: `+${stats.ordersGrowth}%`, direction: 'up' }}
        />
        <KpiCard
          label="Active Customers"
          value={stats.activeCustomers.toLocaleString()}
          trend={{ value: `+${stats.customerGrowth}%`, direction: 'up' }}
        />
        <KpiCard
          label="Avg. Engagement Score"
          value={`${stats.avgEngagementScore}`}
          icon="auto_awesome"
          iconColor="text-primary"
        >
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-success w-[88%] rounded-full" />
            </div>
            <span className="font-label-sm text-success font-semibold">{stats.avgEngagementScore}/100</span>
          </div>
        </KpiCard>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">inventory</span>
            </div>
            <span className="text-error font-semibold text-label-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              {Math.abs(stats.inventoryChange)}%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-label-md font-label-md text-outline uppercase tracking-wider">Inventory Value</div>
            <div className="text-headline-lg font-headline-lg text-on-surface mt-1">${(stats.inventoryValue / 1000).toFixed(0)}k</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl ml-border">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <span className="text-primary font-semibold text-label-md">AI Optimal</span>
          </div>
          <div className="mt-4">
            <div className="text-label-md font-label-md text-outline uppercase tracking-wider">Efficiency Score</div>
            <div className="text-headline-lg font-headline-lg text-on-surface mt-1">{stats.efficiencyScore}%</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">shopping_cart_checkout</span>
            </div>
            <span className="text-success font-semibold text-label-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +{stats.fulfillmentGrowth}%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-label-md font-label-md text-outline uppercase tracking-wider">Orders Fulfilled</div>
            <div className="text-headline-lg font-headline-lg text-on-surface mt-1">{stats.ordersFulfilled.toLocaleString()}</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">people</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-label-md font-label-md text-outline uppercase tracking-wider">Avg. LTV</div>
            <div className="text-headline-lg font-headline-lg text-on-surface mt-1">${stats.avgLifetimeValue.toLocaleString()}</div>
          </div>
        </div>
      </div>
      {insights.slice(0, 1).map((insight) => (
        <InsightCard
          key={insight.id}
          icon="psychology"
          title={insight.title}
          description={insight.description}
          actions={
            <>
              <button className="px-6 py-3 rounded-xl bg-primary-container text-on-primary font-bold shadow-md hover:opacity-90 active:scale-95 transition-all">
                {insight.actionLabel}
              </button>
              <button className="w-12 h-12 rounded-xl border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </>
          }
        />
      ))}
    </>
  )
}
