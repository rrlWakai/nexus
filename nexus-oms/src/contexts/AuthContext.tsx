import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const DEMO_EMAIL = 'admin123@gmail.com'
const DEMO_PASSWORD = 'admin123'

interface DemoUser {
  email: string
  role: string
  name: string
}

interface AuthContextType {
  user: DemoUser | null
  loading: boolean
  signIn: (email: string, password: string) => { error: string | null }
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored === 'true') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setLoading(false)
  }, [])

  function signIn(email: string, password: string) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const userData = { email: DEMO_EMAIL, role: 'admin', name: 'Administrator' }
      localStorage.setItem('auth', 'true')
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { error: null }
    }
    return { error: 'Invalid email or password.' }
  }

  function signOut() {
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
