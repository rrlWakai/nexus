import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="fixed -z-10 top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-fixed-dim/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary-fixed-dim/10 blur-[120px] rounded-full" />
      </div>
      <main className="flex flex-col items-center justify-center p-gutter min-h-screen">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
