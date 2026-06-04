import ws from 'ws'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fsjfrajnvfbpgonmtrjx.supabase.co',
  'sb_publishable_i5BkGAlnm1aDHtjKiMo5hg__g_CjnSy',
  { realtime: { transport: ws } }
)

// Try signing up
const { data, error } = await supabase.auth.signUp({
  email: 'admin123@gmail.com',
  password: 'admin123'
})
if (error) {
  console.error('Signup error:', error.message)
  // Maybe user exists already - try sign in
  const { data: s, error: se } = await supabase.auth.signInWithPassword({
    email: 'admin123@gmail.com',
    password: 'admin123'
  })
  if (se) {
    console.error('Signin error:', se.message)
  } else {
    console.log('Signed in as:', s.user?.id)
  }
} else {
  console.log('Signed up as:', data.user?.id)
}
