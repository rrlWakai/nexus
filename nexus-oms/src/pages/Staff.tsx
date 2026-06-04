import MlInsightCard from '@/components/cards/MlInsightCard'
import { staffMembers } from '@/lib/data'

export default function Staff() {
  const performanceBars = (data: number[]) => {
    const max = Math.max(...data)
    return (
      <div className="mt-6 h-12 flex items-end gap-1">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${(v / max) * 100}%`,
              backgroundColor: v === max ? 'var(--color-primary)' : `rgba(0, 78, 159, 0.1)`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <nav className="flex gap-2 text-label-sm text-ink-secondary mb-2 uppercase tracking-widest">
            <span>Admin</span>
            <span>/</span>
            <span className="text-primary font-bold">Staff Management</span>
          </nav>
          <h2 className="font-headline-xl text-headline-xl text-ink-primary">Team Operations</h2>
          <p className="text-body-lg text-ink-secondary mt-1 max-w-xl">Monitor performance metrics, manage roles, and optimize warehouse throughput through enterprise intelligence insights.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-4 rounded-xl flex flex-col items-end">
            <span className="text-label-sm text-ink-secondary uppercase tracking-tighter">Active Members</span>
            <span className="text-headline-lg font-bold text-primary">124</span>
          </div>
          <div className="glass-card px-6 py-4 rounded-xl flex flex-col items-end">
            <span className="text-label-sm text-ink-secondary uppercase tracking-tighter">Avg Productivity</span>
            <span className="text-headline-lg font-bold text-success">+14.2%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 glass-card p-4 rounded-2xl flex flex-wrap gap-4 items-center">
          <button className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md">All Members</button>
          <button className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant text-label-md transition-colors">Warehouse</button>
          <button className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant text-label-md transition-colors">Sales</button>
          <button className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant text-label-md transition-colors">Logistics</button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-label-sm text-ink-secondary">Sort by:</span>
            <select className="bg-transparent border-none text-label-md font-semibold text-primary focus:ring-0 cursor-pointer">
              <option>Performance</option>
              <option>Newest</option>
              <option>Orders Processed</option>
            </select>
          </div>
        </div>
        {staffMembers.map((staff) => (
          <div key={staff.id} className={`md:col-span-4 glass-card p-6 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 ${staff.badge === 'Elite Performer' ? 'ml-border' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {staff.initials}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${staff.status === 'Active Now' ? 'bg-success' : staff.status === 'In Meeting' ? 'bg-warning' : 'bg-surface-container-highest'}`} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${staff.badge === 'Elite Performer' ? 'bg-primary-container text-on-primary-container' : staff.badge === 'Consistent High' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{staff.badge}</span>
                <div className="flex mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`material-symbols-outlined text-[18px] ${i < staff.rating ? 'text-warning' : 'text-outline-variant'}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-ink-primary">{staff.name}</h3>
            <p className="text-label-md text-primary font-semibold mb-6">{staff.role}</p>
            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/10 pt-6">
              <div>
                <p className="text-label-sm text-ink-secondary uppercase tracking-tight">{staff.department === 'Sales' ? 'Revenue Gen' : 'Total Orders'}</p>
                <p className="text-headline-md font-bold text-ink-primary">{staff.department === 'Sales' ? `$${(staff.totalOrders / 10).toFixed(0)}k` : staff.totalOrders.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-label-sm text-ink-secondary uppercase tracking-tight">Productivity</p>
                <div className="flex items-center gap-1">
                  <span className={`material-symbols-outlined text-[16px] ${staff.productivityTrend === 'up' ? 'text-success' : 'text-error'}`}>
                    {staff.productivityTrend === 'up' ? 'trending_up' : 'trending_down'}
                  </span>
                  <p className={`text-headline-md font-bold ${staff.productivityTrend === 'up' ? 'text-success' : 'text-error'}`}>
                    {staff.productivity >= 0 ? '+' : ''}{staff.productivity}%
                  </p>
                </div>
              </div>
            </div>
            {performanceBars(staff.performanceData)}
          </div>
        ))}
        <div className="md:col-span-12 glass-card rounded-3xl overflow-hidden mt-6">
          <div className="px-gutter py-6 flex justify-between items-center bg-surface-container-low/50 border-b border-outline-variant/10">
            <h4 className="font-headline-md text-ink-primary">Detailed Performance Audit</h4>
            <button className="text-primary font-label-md flex items-center gap-2 hover:opacity-80">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Detailed Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant/10">
                  <th className="px-gutter py-4 font-label-sm text-ink-secondary uppercase tracking-widest">Team Member</th>
                  <th className="px-gutter py-4 font-label-sm text-ink-secondary uppercase tracking-widest">Activity Status</th>
                  <th className="px-gutter py-4 font-label-sm text-ink-secondary uppercase tracking-widest">Accuracy Rating</th>
                  <th className="px-gutter py-4 font-label-sm text-ink-secondary uppercase tracking-widest">Peak Hour Efficiency</th>
                  <th className="px-gutter py-4 font-label-sm text-ink-secondary uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-gutter py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{staff.initials}</div>
                        <span className="font-label-md text-ink-primary">{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-gutter py-4">
                      <span className={`flex items-center gap-2 text-label-md ${staff.status === 'Active Now' ? 'text-success' : staff.status === 'In Meeting' ? 'text-success' : 'text-on-surface-variant'}`}>
                        <span className={`w-2 h-2 rounded-full ${staff.status === 'Active Now' ? 'bg-success' : staff.status === 'In Meeting' ? 'bg-success' : 'bg-outline-variant'}`} />
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-gutter py-4 text-label-md text-ink-secondary">{staff.accuracy}%</td>
                    <td className="px-gutter py-4">
                      <div className="w-32 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${staff.efficiency}%` }} />
                      </div>
                    </td>
                    <td className="px-gutter py-4 text-right">
                      <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:col-span-8">
          <MlInsightCard
            icon="psychology"
            title="Predictive Staffing Intelligence"
            description="Based on historical order volume trends, Nexus AI suggests a 15% increase in staffing for the Northwest Warehouse sector between 14:00 and 17:00 today to maintain optimal throughput."
          >
            <div className="flex gap-12">
              <div>
                <p className="text-label-sm text-ink-secondary uppercase mb-1">Forecasted Load</p>
                <p className="text-display-lg font-bold text-ink-primary">High</p>
              </div>
              <div>
                <p className="text-label-sm text-ink-secondary uppercase mb-1">Efficiency Gap</p>
                <p className="text-display-lg font-bold text-error">12m</p>
              </div>
            </div>
          </MlInsightCard>
        </div>
        <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-3xl flex flex-col justify-between shadow-xl">
          <div>
            <h4 className="font-headline-lg mb-2">Grow Your Team</h4>
            <p className="text-body-md opacity-80 mb-8">Seamlessly onboard new enterprise members with automated credentialing and role-based access control.</p>
          </div>
          <button className="w-full bg-white text-primary py-4 rounded-xl font-bold font-label-md hover:bg-opacity-90 active:scale-95 transition-all">
            Send Invite
          </button>
        </div>
      </div>
    </>
  )
}
