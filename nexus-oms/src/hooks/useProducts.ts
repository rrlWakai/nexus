import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct } from '@/services/productService'
import type { Product } from '@/types'

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts(category)
      setProducts(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [category])

  async function add(input: Omit<Product, 'id' | 'created_at' | 'status'>) {
    const created = await createProduct(input)
    setProducts(prev => [created, ...prev])
    return created
  }

  async function edit(id: string, input: Partial<Product>) {
    const updated = await updateProduct(id, input)
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }

  return { products, loading, error, add, edit, refetch: fetchProducts }
}
