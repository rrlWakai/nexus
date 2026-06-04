import { type NavItem } from '@/types'

interface SidebarProps {
  navItems: NavItem[]
  currentPath: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ navItems, currentPath, isMobileOpen, onMobileClose }: SidebarProps) {
  const sidebar = (
    <aside className="h-full w-72 flex flex-col bg-surface-container-low border-r border-outline-variant/10 shadow-sm">
      <div className="flex flex-col h-full py-2 gap-2">
        <div className="px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">Nexus OMS</h1>
            <p className="text-on-surface-variant font-label-sm opacity-70 tracking-widest uppercase">Enterprise Intelligence</p>
          </div>
          {onMobileClose && (
            <button onClick={onMobileClose} className="lg:hidden p-2 text-on-surface-variant hover:text-ink-primary rounded-lg hover:bg-surface-container-highest">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 relative ${
                  isActive
                    ? 'text-primary font-semibold bg-surface-container-highest'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-body-md">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-primary" />
                )}
              </a>
            )
          })}
        </nav>
        <div className="mt-auto px-4 py-6">
          <a
            href="/orders/new"
            onClick={onMobileClose}
            className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3 px-4 rounded-xl font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Order
          </a>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <div className="hidden lg:flex h-screen fixed left-0 top-0 z-50">
        {sidebar}
      </div>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative h-full shadow-2xl animate-in slide-in-from-left duration-300">
            {sidebar}
          </div>
        </div>
      )}
    </>
  )
}
