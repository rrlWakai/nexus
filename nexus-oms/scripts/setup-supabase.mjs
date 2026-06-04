import ws from 'ws'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsjfrajnvfbpgonmtrjx.supabase.co'
const supabaseKey = 'sb_publishable_i5BkGAlnm1aDHtjKiMo5hg__g_CjnSy'

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: ws },
  auth: { autoRefreshToken: false, persistSession: false }
})

// Step 1: Try signup with a proper email
const { data: signupData, error: signupError } = await supabase.auth.signUp({
  email: 'admin@nexusoms.com',
  password: 'admin123!',
  options: { data: { role: 'admin' } }
})
if (signupError) {
  console.log('Signup error:', signupError.message)
  // Try signin if user already exists
  const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
    email: 'admin@nexusoms.com',
    password: 'admin123!'
  })
  if (signinError) {
    console.log('Signin error:', signinError.message)
    process.exit(1)
  }
  console.log('Signed in successfully, user:', signinData.user.id)
  // Try seeding with this session
  const { error: insertError } = await supabase.from('products').insert([
    { name: 'Lenovo LOQ Gaming Laptop', category: 'Laptop', price: 49999, stock: 15, sku: 'LEN-LOQ-15', ai_recommended: true, demand_prediction: 94, demand_label: 'High' },
    { name: 'Samsung Galaxy A55', category: 'Cellphone', price: 18999, stock: 42, sku: 'SAM-A55-5G', ai_recommended: true, demand_prediction: 68, demand_label: 'Rising' },
    { name: 'Office Work Table', category: 'Furniture', price: 8500, stock: 8, sku: 'OFC-WT-120', ai_recommended: false, demand_prediction: 42, demand_label: 'Stable' }
  ])
  if (insertError) {
    console.log('Insert error:', insertError.message)
  } else {
    console.log('Products seeded successfully!')
  }
} else {
  console.log('Signup successful, user:', signupData.user.id)
  console.log('Check email for confirmation, then re-run this script')
}
