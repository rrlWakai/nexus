import { useState, useEffect } from 'react'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/services/customerService'
import type { Customer } from '@/types'

export function useCustomers(search?: string) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchCustomers() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCustomers(search)
      setCustomers(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [search])

  async function add(input: Omit<Customer, 'id' | 'initials' | 'created_at'>) {
    const created = await createCustomer(input)
    setCustomers(prev => [created, ...prev])
    return created
  }

  async function edit(id: string, input: Partial<Customer>) {
    const updated = await updateCustomer(id, input)
    setCustomers(prev => prev.map(c => c.id === id ? updated : c))
    return updated
  }

  async function remove(id: string) {
    await deleteCustomer(id)
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  return { customers, loading, error, add, edit, remove, refetch: fetchCustomers }
}
