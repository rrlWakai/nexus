import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'

interface TopNavProps {
  searchPlaceholder?: string
  onSearch?: (value: string) => void
}

export default function TopNav({ searchPlaceholder = "Search...", onSearch }: TopNavProps) {
  const { user, signOut } = useAuthContext()
  const [showMenu, setShowMenu] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'AU'

  const name = user?.name || 'Admin User'
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff'

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-16 z-40 bg-glass-fill backdrop-blur-3xl border-b border-outline-variant/10 flex justify-between items-center px-gutter">
      <div className="relative w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px]">
          search
        </span>
        <input
          className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder={searchPlaceholder}
          type="text"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[22px]">add_circle</span>
        </button>
        <div className="h-8 w-px bg-outline-variant/30 mx-2" />
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="text-right hidden sm:block">
              <p className="font-label-md text-on-surface leading-none">{name}</p>
              <p className="font-label-sm text-on-surface-variant opacity-70">{role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-outline-variant/20 shadow-sm">
              {initials}
            </div>
          </div>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl py-2 shadow-xl z-50">
              <button
                className="w-full px-4 py-2 text-left font-body-md text-body-md text-ink-primary hover:bg-surface-container-highest flex items-center gap-2 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                Profile
              </button>
              <button
                className="w-full px-4 py-2 text-left font-body-md text-body-md text-ink-primary hover:bg-surface-container-highest flex items-center gap-2 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </button>
              <div className="h-px bg-outline-variant/20 my-2" />
              <button
                className="w-full px-4 py-2 text-left font-body-md text-body-md text-error hover:bg-error/5 flex items-center gap-2 transition-colors"
                onClick={() => { signOut(); setShowMenu(false) }}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
