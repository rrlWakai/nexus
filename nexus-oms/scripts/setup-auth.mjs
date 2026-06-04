import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fsjfrajnvfbpgonmtrjx.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_i5BkGAlnm1aDHtjKiMo5hg__g_CjnSy'

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: ws },
})

const email = '0324-0515@lspu.edu.ph'
const password = 'admin123'

async function setup() {
  console.log(`Signing up ${email}...`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: 'Admin User' },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('User already exists. Signing in to create profile...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        console.error('Sign in failed:', signInError.message)
        return
      }
      await createProfile(signInData.user.id)
      return
    }
    console.error('Sign up failed:', error.message)
    return
  }

  if (data.user) {
    console.log('User created! ID:', data.user.id)
    console.log('NOTE: If email confirmation is enabled, check the inbox and confirm before proceeding.')
    await createProfile(data.user.id)
  }
}

async function createProfile(userId) {
  console.log('Creating user profile...')
  const { error } = await supabase.from('users').upsert({
    id: userId,
    email,
    full_name: 'Admin User',
    role: 'admin',
  }, { onConflict: 'id' })

  if (error) {
    console.error('Profile creation failed:', error.message)
    return
  }
  console.log('Profile created successfully!')
  console.log('You can now sign in with:')
  console.log('  Email:   0324-0515@lspu.edu.ph')
  console.log('  Password: admin123')
}

setup()
