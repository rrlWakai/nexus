import { supabase } from '@/lib/supabase'
import type { AnalyticsData, DashboardStats, MLInsight } from '@/types'
import { getProductCount, getInventoryValue } from './productService'
import { getOrderCount, getRevenueTotal, getRevenueByMonth, getOrdersByMonth } from './orderService'
import { getCustomerCount } from './customerService'

export async function getMostOrderedProduct(): Promise<{ name: string; count: number } | null> {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_name, quantity')

  if (error) throw new Error(error.message)

  const counts: Record<string, number> = {}
  for (const item of (data as { product_name: string; quantity: number }[]) || []) {
    counts[item.product_name] = (counts[item.product_name] || 0) + item.quantity
  }

  const entries = Object.entries(counts)
  if (entries.length === 0) return null

  const top = entries.sort((a, b) => b[1] - a[1])[0]
  return { name: top[0], count: top[1] }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalOrders, totalRevenue, activeCustomers, productCount, inventoryValue] = await Promise.all([
    getOrderCount(),
    getRevenueTotal(),
    getCustomerCount(),
    getProductCount(),
    getInventoryValue(),
  ])

  return {
    totalRevenue,
    totalOrders,
    activeCustomers,
    productCount,
    inventoryValue,
    revenueGrowth: 12.5,
    ordersGrowth: 12,
    customerGrowth: 12,
    avgLifetimeValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    avgEngagementScore: 88,
    inventoryChange: -2.1,
    efficiencyScore: 94.8,
    ordersFulfilled: totalOrders,
    fulfillmentGrowth: 5.4,
    processingOrders: 0,
    avgPriority: 8.2,
  }
}



export async function getAnalyticsData(): Promise<AnalyticsData> {
  const revenue = await getRevenueByMonth()
  const orders = await getOrdersByMonth()

  const { data: customers } = await supabase.from('customers').select('segment')
  const segmentMap: Record<string, number> = {}
  for (const c of (customers as { segment: string }[]) || []) {
    segmentMap[c.segment] = (segmentMap[c.segment] || 0) + 1
  }
  const colors = ['#0066cc', '#34C759', '#FF9F0C', '#883700', '#aac7ff']
  const customerSegments = Object.entries(segmentMap).map(([name, value], i) => ({
    name, value, color: colors[i % colors.length],
  }))

  const { data: products } = await supabase.from('order_items').select(`
    product_name, subtotal
  `).limit(100)

  const productRevMap: Record<string, number> = {}
  for (const p of (products as { product_name: string; subtotal: number }[]) || []) {
    productRevMap[p.product_name] = (productRevMap[p.product_name] || 0) + Number(p.subtotal)
  }
  const productPerformance = Object.entries(productRevMap)
    .map(([name, revenue]) => ({ name, revenue, growth: Math.floor(Math.random() * 30) - 5 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  const revenueGrowth = revenue.length >= 2
    ? ((revenue[revenue.length - 1].value - revenue[0].value) / (revenue[0].value || 1)) * 100
    : 0

  return {
    revenue,
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    orders,
    ordersGrowth: 8.3,
    customerSegments,
    productPerformance,
    salesForecast: revenue.map(r => r.value),
    confidence: 92,
    propensityScore: 84.2,
  }
}

export async function getMLInsights(): Promise<MLInsight[]> {
  return [
    {
      id: 'm1',
      type: 'inventory',
      title: 'Inventory Bottleneck Detected',
      description: 'AI has flagged 12 pending orders with high priority scores that are likely to be delayed due to low stock. We recommend prioritizing local supplier fulfillment.',
      severity: 'warning',
      timestamp: '2m ago',
      actionLabel: 'Review Impact',
    },
    {
      id: 'm2',
      type: 'demand',
      title: 'Sales Forecasting Update',
      description: '12-Month projected growth shows 14% surge in consumer electronics for late November.',
      severity: 'info',
      timestamp: '5m ago',
      actionLabel: 'View Forecast',
    },
    {
      id: 'm3',
      type: 'staffing',
      title: 'Predictive Staffing Intelligence',
      description: 'Based on historical order volume trends, Nexus AI suggests a 15% increase in staffing for the Northwest Warehouse sector between 14:00 and 17:00 today.',
      severity: 'info',
      timestamp: '10m ago',
      actionLabel: 'Review Staffing',
    },
  ]
}
