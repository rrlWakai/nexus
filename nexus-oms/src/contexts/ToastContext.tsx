import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`glass-panel rounded-xl px-5 py-4 flex items-center gap-3 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
              toast.type === 'success' ? 'border-l-4 border-success' :
              toast.type === 'error' ? 'border-l-4 border-error' :
              toast.type === 'warning' ? 'border-l-4 border-warning' :
              'border-l-4 border-primary'
            }`}
          >
            <span className={`material-symbols-outlined ${
              toast.type === 'success' ? 'text-success' :
              toast.type === 'error' ? 'text-error' :
              toast.type === 'warning' ? 'text-warning' :
              'text-primary'
            }`}>
              {toast.type === 'success' ? 'check_circle' :
               toast.type === 'error' ? 'error' :
               toast.type === 'warning' ? 'warning' :
               'info'}
            </span>
            <span className="flex-1 font-body-md text-body-md text-ink-primary">{toast.message}</span>
            <button className="text-on-surface-variant hover:text-ink-primary" onClick={() => dismissToast(toast.id)}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
