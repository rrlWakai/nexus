import { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/forms/Modal'
import Input from '@/components/forms/Input'
import { useProducts } from '@/hooks/useProducts'
import { useToast } from '@/contexts/ToastContext'
import type { Product } from '@/types'

const CATEGORIES = ['All', 'Laptop', 'Cellphone', 'Furniture'] as const

const categoryIcons: Record<string, string> = {
  Laptop: 'laptop',
  Cellphone: 'smartphone',
  Furniture: 'chair',
}

export default function Products() {
  const [category, setCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('All Statuses')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { products, loading, add, edit, refetch } = useProducts()
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', sku: '', price: 0, category: 'Laptop', stock: 0, demand_prediction: 50, demand_label: 'Stable', ai_recommended: false })
  const [submitting, setSubmitting] = useState(false)

  const filteredProducts = products.filter(p => {
    if (category !== 'All' && p.category !== category) return false
    if (stockFilter !== 'All Statuses' && p.status !== stockFilter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stockStatus = (product: Product) => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'error' }
    if (product.stock <= 20) return { label: 'Low Stock', color: 'warning' }
    return { label: 'In Stock', color: 'success' }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await add(form as any)
      showToast('Product created successfully', 'success')
      setModalOpen(false)
      setForm({ name: '', sku: '', price: 0, category: 'Laptop', stock: 0, demand_prediction: 50, demand_label: 'Stable', ai_recommended: false })
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

  function openEditModal(p: Product) {
    setSelectedProduct(p)
    setForm({
      name: p.name,
      sku: p.sku,
      price: Number(p.price),
      category: p.category || 'Laptop',
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

  if (products.length === 0) {
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[48px] text-outline">inventory_2</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-ink-primary mb-2">No Products Yet</h3>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-md">Your product catalog is empty. Create your first product to start managing inventory.</p>
          <button onClick={() => setModalOpen(true)} className="px-8 py-4 bg-primary text-on-primary rounded-xl font-headline-md font-semibold flex items-center gap-3 hover:shadow-xl transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">add</span>
            Create Product
          </button>
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
                <option>Laptop</option><option>Cellphone</option><option>Furniture</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 font-semibold text-on-surface-variant">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50">{submitting ? 'Creating...' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      </>
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
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-label-md font-medium transition-colors ${category === cat ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input className="w-56 bg-surface-container-low border border-outline-variant/10 rounded-full py-2 pl-9 pr-4 text-body-md focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search products..." type="text" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="bg-surface-container-low border border-outline-variant/10 rounded-lg py-2 px-3 text-label-md font-medium focus:ring-primary focus:border-primary" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option>All Statuses</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md text-label-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm font-semibold' : 'text-outline hover:text-on-surface'}`}>
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-label-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm font-semibold' : 'text-outline hover:text-on-surface'}`}>
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[36px] text-outline">search_off</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-ink-primary mb-1">No Products Found</h3>
          <p className="text-body-md text-on-surface-variant">Try adjusting your search or filter criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const ss = stockStatus(product)
            const catIcon = categoryIcons[product.category || ''] || 'inventory_2'
            return (
              <div key={product.id} className={`glass-card rounded-2xl overflow-hidden group transition-all hover:translate-y-[-4px] ${product.ai_recommended ? 'ai-glow' : ''}`}>
                <div className="relative h-56 w-full bg-gradient-to-br from-primary/10 via-surface-container-low to-surface-container-highest flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-[72px] text-outline/30 group-hover:scale-110 transition-transform duration-500">{catIcon}</span>
                  <div className={`absolute top-4 right-4 bg-${ss.color}/10 backdrop-blur-md text-${ss.color} px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 z-10`}>
                    <span className={`w-1.5 h-1.5 bg-${ss.color} rounded-full`} />
                    {ss.label}
                  </div>
                  {product.ai_recommended && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold rounded-md flex items-center gap-1 z-10">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                      AI RECOMMENDED
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-headline-md text-headline-md text-ink-primary truncate">{product.name}</h3>
                      <p className="text-label-sm text-on-surface-variant mt-0.5">SKU: {product.sku}</p>
                    </div>
                    <p className="font-headline-md text-headline-md font-bold text-primary whitespace-nowrap">${Number(product.price).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2.5 py-1 bg-surface-container-highest rounded-lg text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">{catIcon}</span>
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-outline-variant/10">
                    <div>
                      <p className="text-label-sm text-on-surface-variant">Available Stock</p>
                      <p className={`text-body-lg font-bold ${ss.label === 'Low Stock' ? 'text-warning' : ss.label === 'Out of Stock' ? 'text-error' : 'text-on-surface'}`}>
                        {product.stock.toLocaleString()} Units
                      </p>
                    </div>
                    <button onClick={() => openEditModal(product)} className="px-5 py-2.5 bg-primary/5 text-primary rounded-xl font-label-md font-semibold hover:bg-primary/10 transition-colors">Manage</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container-high">
              <tr>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant">Product</th>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant">SKU</th>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant">Category</th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant">Price</th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant">Stock</th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredProducts.map((product) => {
                const ss = stockStatus(product)
                const catIcon = categoryIcons[product.category || ''] || 'inventory_2'
                return (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[20px]">{catIcon}</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-2">
                            {product.name}
                            {product.ai_recommended && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded">AI</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">{product.sku}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-surface-container rounded-lg text-label-sm">{product.category}</span></td>
                    <td className="px-6 py-4 text-right font-label-md font-semibold">${Number(product.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-label-md">{product.stock.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-label-sm font-semibold bg-${ss.color}/10 text-${ss.color}`}>{ss.label}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(product)} className="px-3 py-1.5 bg-surface-secondary text-primary rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors">Manage</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

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
              <option>Laptop</option><option>Cellphone</option><option>Furniture</option>
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
          <div className="space-y-1">
            <label className="font-label-sm text-on-surface-variant">Category</label>
            <select className="w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              <option>Laptop</option><option>Cellphone</option><option>Furniture</option>
            </select>
          </div>
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
