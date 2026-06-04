import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = signIn(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-container/20">
          <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
        </div>
        <h1 className="font-display-lg text-display-lg text-ink-primary tracking-tight mb-2">Nexus OMS</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Enterprise Intelligence Suite</p>
      </div>
      <div className="glass-card rounded-[32px] p-10 border border-outline-variant/10">
        <h2 className="font-headline-lg text-headline-lg text-ink-primary mb-8 text-center">Sign In</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <span className="font-body-md text-body-md text-error">{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="email">Work Email</label>
            <div className="relative group">
              <input
                className="w-full h-14 bg-surface-container-low border-0 rounded-xl px-5 font-body-md text-body-md text-ink-primary transition-all duration-300 ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-white focus:shadow-sm outline-none"
                id="email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="password">Password</label>
              <a className="font-label-md text-label-md text-primary-container hover:underline transition-all" href="#">Forgot password?</a>
            </div>
            <div className="relative group">
              <input
                className="w-full h-14 bg-surface-container-low border-0 rounded-xl px-5 font-body-md text-body-md text-ink-primary transition-all duration-300 ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-white focus:shadow-sm outline-none"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary-container text-on-primary font-headline-md text-headline-md rounded-xl shadow-lg shadow-primary-container/25 hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            New to Nexus?{' '}
            <a className="text-primary-container font-semibold hover:underline" href="#">Create an account</a>
          </p>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 bg-surface-container/50 px-4 py-2 rounded-full border border-outline-variant/10">
          <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase">Powered by Luminous AI</span>
        </div>
        <nav className="flex gap-8">
          <a className="font-label-sm text-label-sm text-outline hover:text-ink-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-outline hover:text-ink-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-outline hover:text-ink-primary transition-colors" href="#">Enterprise Support</a>
        </nav>
      </div>
    </>
  )
}
