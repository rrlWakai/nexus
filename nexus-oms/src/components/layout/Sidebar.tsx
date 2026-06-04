import { type NavItem } from '@/types'

interface SidebarProps {
  navItems: NavItem[]
  currentPath: string
}

export default function Sidebar({ navItems, currentPath }: SidebarProps) {
  return (
    <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/10 shadow-sm z-50">
      <div className="flex flex-col h-full py-2 gap-2">
        <div className="px-6 py-8">
          <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">Nexus OMS</h1>
          <p className="text-on-surface-variant font-label-sm opacity-70 tracking-widest uppercase">Enterprise Intelligence</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
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
                {isActive && <div className="active-nav-indicator" />}
              </a>
            )
          })}
        </nav>
        <div className="mt-auto px-4 py-6">
          <a
            href="/orders/new"
            className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3 px-4 rounded-xl font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Order
          </a>
        </div>
      </div>

      <style>{`
        .active-nav-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 24px;
          width: 2px;
          background-color: #004e9f;
        }
      `}</style>
    </aside>
  )
}
