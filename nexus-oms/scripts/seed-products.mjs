import ws from 'ws'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fsjfrajnvfbpgonmtrjx.supabase.co',
  'sb_publishable_i5BkGAlnm1aDHtjKiMo5hg__g_CjnSy',
  { realtime: { transport: ws } }
)

const products = [
  { name: 'Lenovo LOQ Gaming Laptop', category: 'Laptop', price: 1200, stock: 50, sku: 'LEN-LOQ-001', ai_recommended: true },
  { name: 'Samsung Galaxy A55', category: 'Cellphone', price: 800, stock: 100, sku: 'SAM-A55-001', ai_recommended: true },
  { name: 'Office Work Table', category: 'Furniture', price: 300, stock: 25, sku: 'OFC-TBL-001', ai_recommended: false },
]

for (const p of products) {
  const { data, error } = await supabase.from('products').insert(p).select()
  if (error) {
    console.error('Insert error for', p.name, ':', error.message)
  } else {
    console.log('Inserted:', data[0].name, 'id:', data[0].id, 'stock:', data[0].stock)
  }
}
