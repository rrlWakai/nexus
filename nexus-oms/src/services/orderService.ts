import { supabase } from '@/lib/supabase'
import type { Order, OrderItem } from '@/types'
import { deductStock } from './productService'

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      items:order_items(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as unknown as Order[]
}

export async function getOrderById(id: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      items:order_items(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as Order
}

export async function createOrderWithItems(
  customerId: string,
  items: { product_id: string; product_name: string; quantity: number; unit_price: number }[],
  notes?: string
): Promise<Order> {
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const orderId = `ORD-${Date.now().toString().slice(-6)}`

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_id: orderId,
      customer_id: customerId,
      total_amount: totalAmount,
      status: 'Pending',
      notes: notes || null,
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw new Error(itemsError.message)

  for (const item of items) {
    await deductStock(item.product_id, item.quantity)
  }

  return { ...order, items: orderItems } as unknown as Order
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as Order
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getOrderCount(): Promise<number> {
  const { count, error } = await supabase.from('orders').select('*', { head: true, count: 'exact' })
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function getRevenueTotal(): Promise<number> {
  const { data, error } = await supabase.from('orders').select('total_amount')
  if (error) throw new Error(error.message)
  return (data as { total_amount: number }[]).reduce((sum, o) => sum + Number(o.total_amount), 0)
}

export async function getRevenueByMonth(): Promise<{ month: string; value: number }[]> {
  const { data, error } = await supabase.from('orders').select('total_amount, created_at').eq('status', 'Delivered')
  if (error) throw new Error(error.message)

  const monthly: Record<string, number> = {}
  for (const row of data as { total_amount: number; created_at: string }[]) {
    const month = new Date(row.created_at).toLocaleString('en-US', { month: 'short', year: '2-digit' })
    monthly[month] = (monthly[month] || 0) + Number(row.total_amount)
  }

  return Object.entries(monthly).map(([month, value]) => ({ month, value }))
}

export async function getOrdersByMonth(): Promise<{ month: string; value: number }[]> {
  const { data, error } = await supabase.from('orders').select('created_at')
  if (error) throw new Error(error.message)

  const monthly: Record<string, number> = {}
  for (const row of data as { created_at: string }[]) {
    const month = new Date(row.created_at).toLocaleString('en-US', { month: 'short', year: '2-digit' })
    monthly[month] = (monthly[month] || 0) + 1
  }

  return Object.entries(monthly).map(([month, value]) => ({ month, value }))
}
