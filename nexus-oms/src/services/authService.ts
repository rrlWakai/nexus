import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as User | null
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No user found after sign in')

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as User
}

export async function signUp(email: string, password: string, fullName: string) {
  const { error: signUpError, data } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (signUpError) throw new Error(signUpError.message)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function createProfile(userId: string, email: string, fullName: string, role = 'staff') {
  const { error } = await supabase.from('users').insert({
    id: userId,
    email,
    full_name: fullName,
    role,
  })
  if (error) throw new Error(error.message)
}
