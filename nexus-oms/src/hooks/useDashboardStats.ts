import { useState, useEffect } from 'react'
import { getDashboardStats, getMLInsights, getMostOrderedProduct } from '@/services/analyticsService'
import { getOrders } from '@/services/orderService'
import { getProducts } from '@/services/productService'
import { getCustomers } from '@/services/customerService'
import type { DashboardStats, MLInsight } from '@/types'

interface DashboardData {
  stats: (DashboardStats & { mostOrderedProduct: { name: string; count: number } | null }) | null
  insights: MLInsight[]
  loading: boolean
  error: string | null
}

export function useDashboardStats(): DashboardData & { refetch: () => Promise<void> } {
  const [data, setData] = useState<DashboardData>({ stats: null, insights: [], loading: true, error: null })

  async function fetchData() {
    setData(prev => ({ ...prev, loading: true, error: null }))
    try {
      const [stats, insights, orders, products, customers, mostOrdered] = await Promise.all([
        getDashboardStats(),
        getMLInsights(),
        getOrders(),
        getProducts(),
        getCustomers(),
        getMostOrderedProduct(),
      ])

      const processingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length
      const avgPriority = orders.length > 0
        ? Math.round((orders.reduce((s, o) => s + o.priority, 0) / orders.length) * 10) / 10
        : 0
      const avgEngagementScore = customers.length > 0
        ? Math.round(customers.reduce((s, c) => s + c.engagement_score, 0) / customers.length)
        : 0
      const avgLifetimeValue = customers.length > 0
        ? Math.round(customers.reduce((s, c) => s + c.lifetime_value, 0) / customers.length)
        : 0

      setData({
        stats: {
          ...stats,
          processingOrders,
          avgPriority,
          avgEngagementScore,
          avgLifetimeValue,
          mostOrderedProduct: mostOrdered,
        },
        insights,
        loading: false,
        error: null,
      })
    } catch (err) {
      setData(prev => ({ ...prev, loading: false, error: (err as Error).message }))
    }
  }

  useEffect(() => { fetchData() }, [])

  return { ...data, refetch: fetchData }
}
