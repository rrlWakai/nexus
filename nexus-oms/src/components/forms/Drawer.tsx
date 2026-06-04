import { useEffect, type ReactNode } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-system-background shadow-2xl z-[101] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          {title && <h3 className="font-headline-lg text-headline-lg text-ink-primary">{title}</h3>}
          <button className="w-10 h-10 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors flex items-center justify-center" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100%-73px)]">{children}</div>
      </div>
    </>
  )
}
