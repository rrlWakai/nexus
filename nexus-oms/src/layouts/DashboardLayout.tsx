import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import TopNav from '@/components/layout/TopNav'
import { useSidebar } from '@/hooks/useSidebar'
import { type NavItem } from '@/types'

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Orders', path: '/orders', icon: 'shopping_cart' },
  { label: 'Customers', path: '/customers', icon: 'group' },
  { label: 'Products', path: '/products', icon: 'inventory_2' },
  { label: 'Analytics & ML', path: '/analytics', icon: 'psychology' },
  { label: 'Staff', path: '/staff', icon: 'badge' },
  { label: 'Reports', path: '/reports', icon: 'assessment' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
]

export default function DashboardLayout() {
  const location = useLocation()
  const { isMobileOpen, toggleMobile, closeMobile } = useSidebar()

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar navItems={navItems} currentPath={location.pathname} isMobileOpen={isMobileOpen} onMobileClose={closeMobile} />
      <main className="min-h-screen lg:ml-72">
        <TopNav onMenuToggle={toggleMobile} />
        <section className="pt-24 pb-12 px-4 sm:px-6 md:px-gutter max-w-container-max mx-auto">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
