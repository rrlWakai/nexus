import { useAuthContext } from '@/contexts/AuthContext'

export default function Settings() {
  const { user, signOut } = useAuthContext()
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'AU'

  return (
    <div className="max-w-[900px] mx-auto">
      <header className="mb-12">
        <h2 className="font-headline-xl text-headline-xl mb-2">Platform Settings</h2>
        <p className="text-on-surface-variant font-body-md">Configure your enterprise workspace, security protocols, and integration endpoints.</p>
      </header>
      <div className="flex flex-col gap-10">
        <div className="glass-card rounded-[24px] p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
            <div>
              <h3 className="font-headline-md text-headline-md mb-1">Profile Management</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Manage personal information and system avatar.</p>
            </div>
            <button className="text-primary font-label-md text-label-md hover:underline">Edit details</button>
          </div>
          <div className="flex gap-10 items-start">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
                <p className="font-body-lg text-body-lg font-medium">{user?.name || 'Admin User'}</p>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                <p className="font-body-lg text-body-lg font-medium">{user?.email || 'admin@nexusoms.enterprise'}</p>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">System Role</label>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full" />
                  <p className="font-body-lg text-body-lg font-medium">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</p>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Timezone</label>
                <p className="font-body-lg text-body-lg font-medium">GMT -05:00 (EST)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-[24px] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-headline-md text-headline-md mb-1">Security & Access</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Manage authentication layers and session persistence.</p>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { icon: 'key', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', defaultChecked: true },
              { icon: 'fingerprint', title: 'Biometric Login', desc: 'Use FaceID or TouchID on supported devices.', defaultChecked: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 group border-t border-outline-variant/10 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-body-lg text-body-lg font-medium">{item.title}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
                <input defaultChecked={item.defaultChecked} className="apple-toggle" type="checkbox" />
              </div>
            ))}
            <div className="flex items-center justify-between py-4 group border-t border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="font-body-lg text-body-lg font-medium">Session Timeout</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">Automatically logout after 30 minutes of inactivity.</p>
                </div>
              </div>
              <select className="bg-surface-secondary border-none rounded-lg text-label-md focus:ring-1 focus:ring-primary px-4 py-2">
                <option>15 Minutes</option>
                <option selected>30 Minutes</option>
                <option>1 Hour</option>
              </select>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-[24px] p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
            <div>
              <h3 className="font-headline-md text-headline-md mb-1">Billing & Subscription</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Your current plan is <span className="text-primary font-semibold">Enterprise Elite</span>.</p>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">Active</span>
          </div>
          <div className="flex items-center gap-6 p-6 bg-primary-container/10 border border-primary-container/20 rounded-2xl">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-[32px]">credit_card</span>
            </div>
            <div className="flex-1">
              <p className="font-body-lg text-body-lg font-semibold">Enterprise Plan</p>
              <p className="font-label-md text-label-md text-on-surface-variant">Next billing date: Monthly • $1,200.00</p>
            </div>
            <button className="bg-white text-primary px-6 py-2 rounded-full font-label-md text-label-md shadow-sm border border-outline-variant/20 hover:bg-primary hover:text-white transition-all">Update</button>
          </div>
        </div>
        <div className="glass-card rounded-[24px] p-8 mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-headline-md text-headline-md mb-1">Danger Zone</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Irreversible actions that affect your account.</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-6 bg-error/5 border border-error/20 rounded-2xl">
            <div>
              <p className="font-body-lg text-body-lg font-semibold text-error">Sign Out</p>
              <p className="font-label-md text-label-md text-on-surface-variant">End your current session and return to the login page.</p>
            </div>
            <button onClick={() => signOut()} className="bg-error text-white px-6 py-2 rounded-xl font-label-md text-label-md hover:bg-error/90 transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
