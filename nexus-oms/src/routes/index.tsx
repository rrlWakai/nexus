import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'

const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Orders = lazy(() => import('@/pages/Orders'))
const NewOrder = lazy(() => import('@/pages/NewOrder'))
const Customers = lazy(() => import('@/pages/Customers'))
const Products = lazy(() => import('@/pages/Products'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Reports = lazy(() => import('@/pages/Reports'))
const Staff = lazy(() => import('@/pages/Staff'))
const Settings = lazy(() => import('@/pages/Settings'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'orders', element: <SuspenseWrapper><Orders /></SuspenseWrapper> },
      { path: 'orders/new', element: <SuspenseWrapper><NewOrder /></SuspenseWrapper> },
      { path: 'customers', element: <SuspenseWrapper><Customers /></SuspenseWrapper> },
      { path: 'products', element: <SuspenseWrapper><Products /></SuspenseWrapper> },
      { path: 'analytics', element: <SuspenseWrapper><Analytics /></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
      { path: 'staff', element: <SuspenseWrapper><Staff /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
