import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

export async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Product[]
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data as Product
}

export async function createProduct(input: Omit<Product, 'id' | 'created_at' | 'status'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(input).select().single()
  if (error) throw new Error(error.message)
  return data as Product
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from('products').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getProductCount(): Promise<number> {
  const { count, error } = await supabase.from('products').select('*', { head: true, count: 'exact' })
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function getInventoryValue(): Promise<number> {
  const { data, error } = await supabase.from('products').select('stock, price')
  if (error) throw new Error(error.message)
  return (data as { stock: number; price: number }[]).reduce((sum, p) => sum + p.stock * p.price, 0)
}

export async function deductStock(productId: string, quantity: number): Promise<void> {
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  if (!product) throw new Error('Product not found')

  const newStock = (product as { stock: number }).stock - quantity
  if (newStock < 0) throw new Error('Insufficient stock')

  const { error: updateError } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)

  if (updateError) throw new Error(updateError.message)
}
