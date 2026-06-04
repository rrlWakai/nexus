import { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/cards/StatCard'
import DataTable from '@/components/tables/DataTable'
import Pagination from '@/components/tables/Pagination'
import Modal from '@/components/forms/Modal'
import Input from '@/components/forms/Input'
import { useCustomers } from '@/hooks/useCustomers'
import { useToast } from '@/contexts/ToastContext'
import type { Customer } from '@/types'

export default function Customers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { customers, loading, add, edit, remove, refetch } = useCustomers(search)
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', segment: 'Mid-Market', lifetime_value: 0, engagement_score: 0, status: 'New' })
  const [submitting, setSubmitting] = useState(false)

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  )

  const segmentBadge = (segment: string) => {
    const styles: Record<string, string> = {
      Enterprise: 'bg-primary/10 text-primary',
      'Mid-Market': 'bg-surface-container-highest text-on-surface-variant',
      'New Startup': 'bg-tertiary/10 text-tertiary',
    }
    return `px-3 py-1 rounded-full text-label-sm font-medium ${styles[segment] || 'bg-surface-container text-on-surface-variant'}`
  }

  const scoreBar = (score: number) => {
    const color = score >= 80 ? 'bg-success' : score >= 60 ? 'bg-warning' : 'bg-error'
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-1 bg-surface-container-highest rounded-full">
          <div className={`${color} h-full rounded-full`} style={{ width: `${score}%` }} />
        </div>
        <span className={`text-label-md font-bold ${score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-error'}`}>{score}</span>
      </div>
    )
  }

  const columns = [
    { key: 'customer', header: 'Customer', render: (c: Customer) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-on-primary-fixed font-bold">{c.initials || c.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <p className="font-semibold text-ink-primary">{c.name}</p>
          <p className="text-label-sm text-on-surface-variant">{c.email}</p>
        </div>
      </div>
    )},
    { key: 'segment', header: 'Segment', render: (c: Customer) => <span className={segmentBadge(c.segment)}>{c.segment}</span> },
    { key: 'ltv', header: 'LTV', render: (c: Customer) => <span className="text-right font-semibold text-ink-primary">${Number(c.lifetime_value).toLocaleString()}</span>, className: 'text-right' },
    { key: 'score', header: 'AI Score', render: (c: Customer) => scoreBar(c.engagement_score) },
    { key: 'lastActive', header: 'Last Active', render: (c: Customer) => <span className="text-on-surface-variant">{new Date(c.last_active).toLocaleDateString()}</span> },
    { key: 'actions', header: 'Actions', render: (c: Customer) => (
      <div className="flex gap-1">
        <button onClick={() => { setSelectedCustomer(c); setEditModalOpen(true) }} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button onClick={() => handleDelete(c.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    ), className: 'text-center' },
  ]

  const stats = {
    total: filtered.length,
    avgLtv: filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + Number(c.lifetime_value), 0) / filtered.length) : 0,
    avgScore: filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.engagement_score, 0) / filtered.length) : 0,
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await add({ ...form, last_active: new Date().toISOString() } as any)
      showToast('Customer created successfully', 'success')
      setModalOpen(false)
      setForm({ name: '', email: '', company: '', phone: '', segment: 'Mid-Market', lifetime_value: 0, engagement_score: 0, status: 'New' })
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedCustomer) return
    setSubmitting(true)
    try {
      await edit(selectedCustomer.id, form as any)
      showToast('Customer updated successfully', 'success')
      setEditModalOpen(false)
      setSelectedCustomer(null)
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await remove(id)
      showToast('Customer deleted successfully', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  function openEditModal(c: Customer) {
    setSelectedCustomer(c)
    setForm({
      name: c.name,
      email: c.email || '',
      company: c.company || '',
      phone: c.phone || '',
      segment: c.segment,
      lifetime_value: Number(c.lifetime_value),
      engagement_score: c.engagement_score,
      status: c.status,
    })
    setEditModalOpen(true)
  }

  useEffect(() => {
    if (selectedCustomer) {
      setForm({
        name: selectedCustomer.name,
        email: selectedCustomer.email || '',
        company: selectedCustomer.company || '',
        phone: selectedCustomer.phone || '',
        segment: selectedCustomer.segment,
        lifetime_value: Number(selectedCustomer.lifetime_value),
        engagement_score: selectedCustomer.engagement_score,
        status: selectedCustomer.status,
      })
    }
  }, [selectedCustomer])

  return (
    <>
      <PageHeader
        title="Customers Directory"
        subtitle="Manage your global customer base with AI-driven engagement metrics and real-time activity tracking."
        actions={
          <>
            <button onClick={() => refetch()} className="flex items-center gap-2 bg-surface-secondary text-primary px-5 py-2.5 rounded-xl font-label-md hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined">refresh</span>
              Refresh
            </button>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md shadow-sm hover:shadow-md transition-all">
              <span className="material-symbols-outlined">person_add</span>
              Add Customer
            </button>
          </>
        }
      />
      <section className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 lg:col-span-4">
          <StatCard icon="groups" iconBg="bg-primary/10" iconColor="text-primary" label="Total Active Customers" value={stats.total.toLocaleString()} trend={{ value: '+12%', direction: 'up' }} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <StatCard icon="payments" iconBg="bg-tertiary/10" iconColor="text-tertiary" label="Avg. Lifetime Value" value={`$${stats.avgLtv.toLocaleString()}`} trend={{ value: '+8.4%', direction: 'up' }} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-card p-6 rounded-3xl ml-border">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-success/10 text-success rounded-2xl">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <span className="text-label-sm font-semibold text-on-surface-variant">Predicted churn: 2.1%</span>
            </div>
            <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Avg. Engagement Score</h3>
            <p className="font-display-lg text-display-lg text-ink-primary">{stats.avgScore}<span className="text-headline-lg font-medium opacity-40">/100</span></p>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-headline-lg text-headline-lg text-ink-primary">All Customers</h3>
          <div className="flex gap-2">
            <input
              className="bg-surface-container-low border-none rounded-lg px-4 py-2 text-label-md"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} headerClassName="bg-surface-container-low" />
        )}
        <Pagination currentPage={page} totalItems={filtered.length} pageSize={25} onPageChange={setPage} />
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Customer">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
          <Input label="Company" value={form.company} onChange={v => setForm(p => ({ ...p, company: v }))} />
          <Input label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
          <div className="space-y-1">
            <label className="font-label-sm text-on-surface-variant">Segment</label>
            <select className="w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4" value={form.segment}
              onChange={e => setForm(p => ({ ...p, segment: e.target.value }))}>
              <option>Enterprise</option><option>Mid-Market</option><option>New Startup</option><option>SME</option><option>Individual</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 font-semibold text-on-surface-variant">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedCustomer(null) }} title="Edit Customer">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
          <Input label="Company" value={form.company} onChange={v => setForm(p => ({ ...p, company: v }))} />
          <Input label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
          <div className="space-y-1">
            <label className="font-label-sm text-on-surface-variant">Segment</label>
            <select className="w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4" value={form.segment}
              onChange={e => setForm(p => ({ ...p, segment: e.target.value }))}>
              <option>Enterprise</option><option>Mid-Market</option><option>New Startup</option><option>SME</option><option>Individual</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => { setEditModalOpen(false); setSelectedCustomer(null) }} className="flex-1 py-3 rounded-xl border border-outline-variant/30 font-semibold text-on-surface-variant">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
