import { supabase } from '@/lib/supabase'
import type { Customer } from '@/types'

export async function getCustomers(search?: string): Promise<Customer[]> {
  let query = supabase.from('customers').select('*').order('created_at', { ascending: false })
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as Customer[]
}

export async function getCustomerById(id: string): Promise<Customer> {
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data as Customer
}

export async function createCustomer(input: Omit<Customer, 'id' | 'initials' | 'created_at'>): Promise<Customer> {
  const { data, error } = await supabase.from('customers').insert(input).select().single()
  if (error) throw new Error(error.message)
  return data as Customer
}

export async function updateCustomer(id: string, input: Partial<Customer>): Promise<Customer> {
  const { data, error } = await supabase.from('customers').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as Customer
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getCustomerCount(): Promise<number> {
  const { count, error } = await supabase.from('customers').select('*', { head: true, count: 'exact' })
  if (error) throw new Error(error.message)
  return count ?? 0
}
