import { supabase } from '@/lib/supabase'
import { kmeans } from 'ml-kmeans'
import type { ClassificationResult, ClusterResult, Product } from '@/types'

export async function classifyCustomers(): Promise<ClassificationResult[]> {
  const { data: customers } = await supabase.from('customers').select('id, name, lifetime_value')

  const { data: orderStats } = await supabase
    .from('orders')
    .select('customer_id, total_amount')

  if (!customers || !orderStats) return []

  const customerMap = new Map<string, { orders: number; spent: number }>()

  for (const c of customers) {
    customerMap.set(c.id, { orders: 0, spent: 0 })
  }

  for (const o of orderStats) {
    const entry = customerMap.get(o.customer_id)
    if (entry) {
      entry.orders += 1
      entry.spent += Number(o.total_amount)
    }
  }

  const results: ClassificationResult[] = []
  for (const c of customers) {
    const stats = customerMap.get(c.id) || { orders: 0, spent: 0 }
    let classification: ClassificationResult['classification']
    if (stats.orders === 0) {
      classification = 'New Customer'
    } else if (stats.orders >= 5) {
      classification = 'Frequent Buyer'
    } else {
      classification = 'Occasional Buyer'
    }
    results.push({
      customerId: c.id,
      customerName: c.name,
      classification,
      numberOfOrders: stats.orders,
      totalSpent: stats.spent,
    })
  }

  return results
}

export async function segmentCustomers(): Promise<ClusterResult[]> {
  const classifications = await classifyCustomers()

  if (classifications.length < 3) return []

  const data = classifications.map(c => [c.numberOfOrders, c.totalSpent])
  const k = 3
  const { clusters } = kmeans(data, k, {})

  const clusterLabels = ['New Buyers', 'Medium Value Buyers', 'High Value Buyers']

  return classifications.map((c, i) => ({
    id: c.customerId,
    name: c.customerName,
    orders: c.numberOfOrders,
    spent: c.totalSpent,
    cluster: clusters[i],
    label: clusterLabels[clusters[i]] || 'Other',
  }))
}

export async function getMostOrderedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity')

  if (error || !data) return []

  const productMap: Record<string, { name: string; qty: number }> = {}
  for (const item of data as { product_id: string; product_name: string; quantity: number }[]) {
    if (!productMap[item.product_id]) {
      productMap[item.product_id] = { name: item.product_name, qty: 0 }
    }
    productMap[item.product_id].qty += item.quantity
  }

  const sorted = Object.entries(productMap).sort((a, b) => b[1].qty - a[1].qty).slice(0, 10)

  const { data: products } = await supabase
    .from('products')
    .select('*')

  const productById = new Map((products as Product[] || []).map(p => [p.id, p]))

  return sorted.map(([id, info]) => ({
    ...(productById.get(id) || {}),
    id,
    name: info.name,
  } as unknown as Product))
}

export async function getTrendingProducts(): Promise<Product[]> {
  const recent = await getMostOrderedProducts()
  return recent.slice(0, 5)
}

export async function getRecommendedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('ai_recommended', true)
    .limit(5)

  if (error) return []
  return data as Product[]
}

export async function getCustomerSegments(): Promise<{ name: string; value: number; color: string }[]> {
  const { data, error } = await supabase.from('customers').select('segment')
  if (error) return []

  const counts: Record<string, number> = {}
  for (const c of (data as { segment: string }[])) {
    counts[c.segment] = (counts[c.segment] || 0) + 1
  }

  const colors = ['#0066cc', '#34C759', '#FF9F0C', '#883700', '#aac7ff', '#FF6482']
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length],
  }))
}
