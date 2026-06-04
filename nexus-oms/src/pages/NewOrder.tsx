import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { useToast } from '@/contexts/ToastContext'
import { getCustomers } from '@/services/customerService'
import { getProducts } from '@/services/productService'
import { createOrderWithItems } from '@/services/orderService'
import type { Customer, Product } from '@/types'

interface CartItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export default function NewOrder() {
  const { showToast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [notes, setNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getCustomers().then(setCustomers).catch(console.error)
    getProducts().then(setProducts).catch(console.error)
  }, [])

  const filteredProducts = products.filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product_id: product.id, product_name: product.name, quantity: 1, unit_price: Number(product.price) }]
    })
  }

  function updateCartQty(productId: string, delta: number) {
    setCart(prev => prev.map(item => {
      if (item.product_id !== productId) return item
      const newQty = Math.max(1, item.quantity + delta)
      return { ...item, quantity: newQty }
    }))
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(item => item.product_id !== productId))
  }

  const subtotal = cart.reduce((s, item) => s + item.quantity * item.unit_price, 0)
  const shipping = subtotal > 0 ? 45 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  async function handlePlaceOrder() {
    if (!selectedCustomerId) {
      showToast('Please select a customer', 'error')
      return
    }
    if (cart.length === 0) {
      showToast('Please add at least one product', 'error')
      return
    }
    setSubmitting(true)
    try {
      const order = await createOrderWithItems(selectedCustomerId, cart, notes)
      showToast(`Order ${order.order_id} created successfully!`, 'success')
      setCart([])
      setSelectedCustomerId('')
      setNotes('')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Orders', href: '/orders' }, { label: 'New Order' }]} />
      <div className="flex justify-between items-end mb-10">
        <h2 className="font-display-lg text-display-lg text-ink-primary tracking-tight">Create New Order</h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 font-label-md text-label-md font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-xl">Save as Draft</button>
          <button onClick={handlePlaceOrder} disabled={submitting} className="px-6 py-3 font-label-md text-label-md font-semibold bg-primary text-white hover:opacity-90 transition-all rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50">
            {submitting ? 'Processing...' : 'Review Order'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          <section className="glass-panel rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-ink-primary">Customer Selection</h3>
              </div>
            </div>
            <div className="relative">
              <select
                className="w-full h-14 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 font-body-md focus:ring-2 focus:ring-primary/20 transition-all"
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Select a customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.company || c.email}</option>
                ))}
              </select>
            </div>
          </section>
          <section className="glass-panel rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-ink-primary">Product Catalog</h3>
              </div>
            </div>
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl pl-12 pr-4 font-body-md focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search products..." type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-xl p-4 border border-outline-variant/5 transition-all hover:translate-y-[-4px] hover:shadow-lg">
                  <div className="mb-4 aspect-square rounded-lg bg-surface-container-low overflow-hidden flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px]">inventory_2</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{product.name}</h4>
                  <p className="font-label-sm text-label-sm text-outline mb-4">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">${Number(product.price).toFixed(2)}</span>
                    <button onClick={() => addToCart(product)} className="h-10 w-10 rounded-full bg-primary-container text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="glass-panel rounded-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-ink-primary">Fulfillment Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1">Shipping Method</label>
                <select className="w-full h-12 bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 font-body-md focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>Standard Express (3-5 Days)</option>
                  <option>Overnight Priority (Next Day)</option>
                  <option>LTL Freight Shipping</option>
                </select>
              </div>
              <div className="col-span-full space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1">Order Notes</label>
                <textarea className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl p-4 font-body-md focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Special handling instructions, gate codes, or delivery preferences..." rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          </section>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="sticky top-24 space-y-gutter">
            <section className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-md text-headline-md text-ink-primary">Order Cart</h3>
                <span className="px-2 py-1 bg-primary/10 text-primary font-bold text-[10px] rounded-full">{cart.length} ITEMS</span>
              </div>
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center py-8 text-on-surface-variant font-body-md">No items added yet.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product_id} className="flex gap-4 p-3 bg-white rounded-xl border border-outline-variant/5">
                      <div className="h-14 w-14 rounded-lg bg-surface-container-low flex-shrink-0 flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-label-md text-label-md font-semibold text-on-surface truncate">{item.product_name}</h5>
                          <button onClick={() => removeFromCart(item.product_id)} className="text-outline hover:text-error transition-colors flex-shrink-0">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-3 bg-surface-container-low px-2 py-1 rounded-lg">
                            <button onClick={() => updateCartQty(item.product_id, -1)} className="text-outline hover:text-on-surface"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                            <span className="font-label-md text-label-md font-bold">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product_id, 1)} className="text-outline hover:text-on-surface"><span className="material-symbols-outlined text-[16px]">add</span></button>
                          </div>
                          <span className="font-label-md text-label-md text-primary font-bold">${(item.quantity * item.unit_price).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-3 pt-6 border-t border-outline-variant/10">
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-body-md text-body-md">Subtotal</span>
                  <span className="font-label-md text-label-md font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-body-md text-body-md">Shipping</span>
                  <span className="font-label-md text-label-md font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-body-md text-body-md">Tax (8%)</span>
                  <span className="font-label-md text-label-md font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 text-on-surface">
                  <span className="font-headline-md text-headline-md font-bold">Total</span>
                  <span className="font-headline-md text-headline-md font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={submitting || cart.length === 0}
                className="w-full mt-8 py-4 bg-primary text-white font-headline-md rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="mt-4 text-center font-label-sm text-label-sm text-outline">
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">security</span>
                Authorized Transaction Secured by Nexus ML
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
