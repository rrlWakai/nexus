import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus, deleteOrder } from '@/services/orderService'
import type { Order } from '@/types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  async function updateStatus(id: string, status: Order['status']) {
    const updated = await updateOrderStatus(id, status)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o))
    return updated
  }

  async function remove(id: string) {
    await deleteOrder(id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  return { orders, loading, error, updateStatus, remove, refetch: fetchOrders }
}
