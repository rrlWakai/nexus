import PageHeader from '@/components/layout/PageHeader'
import KpiCard from '@/components/cards/KpiCard'
import DataTable from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import InsightCard from '@/components/cards/InsightCard'
import { useOrders } from '@/hooks/useOrders'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useToast } from '@/contexts/ToastContext'
import type { Order } from '@/types'
import { useState } from 'react'

export default function Orders() {
  const [page, setPage] = useState(1)
  const { orders, loading, updateStatus, remove } = useOrders()
  const { insights } = useDashboardStats()
  const { showToast } = useToast()

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Processing: 'bg-warning/10 text-warning border border-warning/20',
      Shipped: 'bg-primary/10 text-primary border border-primary/20',
      Delivered: 'bg-success/10 text-success border border-success/20',
      Pending: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/20',
      Cancelled: 'bg-error/10 text-error border border-error/20',
    }
    return `px-3 py-1 rounded-full text-[12px] font-semibold ${styles[status] || 'bg-surface-container text-on-surface-variant'}`
  }

  const priorityBar = (priority: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 w-20 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${priority * 10}%`,
              backgroundColor: priority >= 8 ? 'var(--color-error)' : priority >= 5 ? 'var(--color-warning)' : 'var(--color-primary)',
              boxShadow: priority >= 8 ? '0 0 8px rgba(255,59,48,0.4)' : 'none',
            }}
          />
        </div>
        <span className="font-label-md font-bold" style={{ color: priority >= 8 ? 'var(--color-error)' : priority >= 5 ? 'var(--color-warning)' : 'var(--color-primary)' }}>
          {priority.toFixed(1)}
        </span>
      </div>
    )
  }

  async function handleStatusUpdate(id: string, status: Order['status']) {
    try {
      await updateStatus(id, status)
      showToast(`Order status updated to ${status}`, 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this order?')) return
    try {
      await remove(id)
      showToast('Order deleted', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length,
    avgPriority: orders.length > 0 ? orders.reduce((s, o) => s + o.priority, 0) / orders.length : 0,
    revenue: orders.reduce((s, o) => s + Number(o.total_amount), 0),
  }

  const columns = [
    { key: 'orderId', header: 'Order ID', render: (o: Order) => <span className="font-body-md font-semibold text-primary">#{o.order_id}</span> },
    { key: 'customer', header: 'Customer', render: (o: Order) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px]">
          {o.customer?.initials || o.customer?.name?.slice(0, 2).toUpperCase() || '--'}
        </div>
        <div>
          <p className="font-body-md font-medium text-ink-primary">{o.customer?.name || 'Unknown'}</p>
          <p className="text-[12px] text-on-surface-variant opacity-70">{o.customer?.email || ''}</p>
        </div>
      </div>
    )},
    { key: 'status', header: 'Status', render: (o: Order) => (
      <select
        className={`${statusBadge(o.status)} border-none cursor-pointer focus:ring-0`}
        value={o.status}
        onChange={e => handleStatusUpdate(o.id, e.target.value as Order['status'])}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    )},
    { key: 'total', header: 'Total', render: (o: Order) => <span className="font-body-md font-medium text-ink-primary">${Number(o.total_amount).toFixed(2)}</span> },
    { key: 'priority', header: 'AI Priority', render: (o: Order) => priorityBar(o.priority) },
    { key: 'actions', header: 'Actions', render: (o: Order) => (
      <div className="text-right flex gap-1 justify-end">
        <button onClick={() => handleDelete(o.id)} className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-error">
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
        <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">more_vert</span>
        </button>
      </div>
    ), className: 'text-right' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Orders Management"
        subtitle="Real-time tracking and intelligent prioritization of customer orders."
        actions={
          <>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/30 font-semibold text-on-surface-variant bg-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
            <a href="/orders/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Order
            </a>
          </>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Orders" value={stats.total.toLocaleString()} trend={{ value: '+12%', direction: 'up' }} />
        <KpiCard label="Processing" value={stats.processing} accentBorder accentColor="border-l-warning" icon="" iconColor="text-warning">
          <div className="flex justify-end mt-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          </div>
        </KpiCard>
        <KpiCard label="Avg. Priority" value={<>{stats.avgPriority.toFixed(1)}<span className="text-label-md text-on-surface-variant font-normal ml-1">/ 10</span></>} icon="psychology" />
        <KpiCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="payments" iconColor="text-success" />
      </div>
      <div className="bg-system-background rounded-3xl shadow-[0px_10px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 overflow-hidden">
        <DataTable columns={columns} data={orders} />
        <Pagination currentPage={page} totalItems={orders.length} pageSize={10} onPageChange={setPage} />
      </div>
      {insights.slice(0, 1).map((insight) => (
        <div key={insight.id} className="mt-12">
          <InsightCard
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
        </div>
      ))}
    </>
  )
}
