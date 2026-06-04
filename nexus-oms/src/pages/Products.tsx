import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/forms/Modal'
import Input from '@/components/forms/Input'
import { useProducts } from '@/hooks/useProducts'
import { useToast } from '@/contexts/ToastContext'
import type { Product } from '@/types'

export default function Products() {
  const [category, setCategory] = useState('All')
  const { products, loading, add, edit, refetch } = useProducts(category)
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', sku: '', price: 0, category: 'Electronics', stock: 0, demand_prediction: 50, demand_label: 'Stable', ai_recommended: false })
  const [submitting, setSubmitting] = useState(false)

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const statusBadge = (status: string) => {
    const isInStock = status === 'In Stock'
    const isLowStock = status === 'Low Stock'
    const color = isInStock ? 'success' : isLowStock ? 'warning' : 'error'
    return (
      <div className={`absolute top-4 right-4 bg-${color}/10 backdrop-blur-md text-${color} px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1`}>
        <span className={`w-1.5 h-1.5 bg-${color} rounded-full`} />
        {status}
      </div>
    )
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await add(form as any)
      showToast('Product created successfully', 'success')
      setModalOpen(false)
      setForm({ name: '', sku: '', price: 0, category: 'Electronics', stock: 0, demand_prediction: 50, demand_label: 'Stable', ai_recommended: false })
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProduct) return
    setSubmitting(true)
    try {
      await edit(selectedProduct.id, { ...form, price: Number(form.price), stock: Number(form.stock), demand_prediction: Number(form.demand_prediction) } as any)
      showToast('Product updated successfully', 'success')
      setEditModalOpen(false)
      setSelectedProduct(null)
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStockUpdate(id: string, delta: number) {
    const product = products.find(p => p.id === id)
    if (!product) return
    const newStock = Math.max(0, product.stock + delta)
    try {
      await edit(id, { stock: newStock } as any)
      showToast(`Stock updated to ${newStock}`, 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  function openEditModal(p: Product) {
    setSelectedProduct(p)
    setForm({
      name: p.name,
      sku: p.sku,
      price: Number(p.price),
      category: p.category || 'Electronics',
      stock: p.stock,
      demand_prediction: p.demand_prediction,
      demand_label: p.demand_label,
      ai_recommended: p.ai_recommended,
    })
    setEditModalOpen(true)
  }

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
        title="Product Inventory"
        subtitle="Manage your global catalog and AI-driven stock predictions."
        actions={
          <button onClick={() => setModalOpen(true)} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold flex items-center gap-2 hover:shadow-xl transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">add</span>
            New Product
          </button>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-label-md font-label-md text-on-surface-variant mr-2">Category:</span>
          <button onClick={() => setCategory('All')} className={`px-4 py-2 rounded-full text-label-md font-medium transition-colors ${category === 'All' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat!)} className={`px-4 py-2 rounded-full text-label-md font-medium transition-colors ${category === cat ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="glass-card rounded-2xl overflow-hidden group transition-all hover:translate-y-[-4px]">
            <div className="relative h-64 w-full bg-surface-container-low">
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-surface-container-low" />
              {statusBadge(product.status)}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline-md text-headline-md text-ink-primary">{product.name}</h3>
                <p className="font-headline-md text-headline-md font-bold text-primary">${Number(product.price).toFixed(2)}</p>
              </div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-6">SKU: {product.sku}</p>
              <div className="ai-glow p-4 rounded-xl mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm text-primary uppercase">AI Prediction</p>
                    <p className="text-body-md font-semibold text-on-surface">Demand: {product.demand_label} ({product.demand_prediction}%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-label-sm text-on-surface-variant">Next Ship: {product.next_shipment ? new Date(product.next_shipment).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-label-sm text-on-surface-variant">Available Stock</p>
                  <p className={`text-body-lg font-bold ${product.status === 'Low Stock' ? 'text-warning' : 'text-on-surface'}`}>
                    {product.stock.toLocaleString()} Units
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleStockUpdate(product.id, -1)} className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <button onClick={() => handleStockUpdate(product.id, 1)} className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                  <button onClick={() => openEditModal(product)} className="px-4 py-2 bg-surface-secondary text-primary rounded-lg font-label-md hover:bg-primary-fixed-dim transition-colors">Manage</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Product">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
          <Input label="SKU" value={form.sku} onChange={v => setForm(p => ({ ...p, sku: v }))} required />
          <Input label="Price" type="number" step="0.01" value={String(form.price)} onChange={v => setForm(p => ({ ...p, price: parseFloat(v) || 0 }))} />
          <Input label="Stock" type="number" value={String(form.stock)} onChange={v => setForm(p => ({ ...p, stock: parseInt(v) || 0 }))} />
          <div className="space-y-1">
            <label className="font-label-sm text-on-surface-variant">Category</label>
            <select className="w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              <option>Electronics</option><option>Fashion</option><option>Home</option><option>Accessories</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 font-semibold text-on-surface-variant">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50">{submitting ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedProduct(null) }} title="Edit Product">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} required />
          <Input label="SKU" value={form.sku} onChange={v => setForm(p => ({ ...p, sku: v }))} required />
          <Input label="Price" type="number" step="0.01" value={String(form.price)} onChange={v => setForm(p => ({ ...p, price: parseFloat(v) || 0 }))} />
          <Input label="Stock" type="number" value={String(form.stock)} onChange={v => setForm(p => ({ ...p, stock: parseInt(v) || 0 }))} />
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="ai_recommended" checked={form.ai_recommended}
              onChange={e => setForm(p => ({ ...p, ai_recommended: e.target.checked }))}
              className="apple-toggle" />
            <label htmlFor="ai_recommended" className="font-label-md">AI Recommended</label>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => { setEditModalOpen(false); setSelectedProduct(null) }} className="flex-1 py-3 rounded-xl border border-outline-variant/30 font-semibold text-on-surface-variant">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
