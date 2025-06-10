import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Menu, X } from 'lucide-react'

const tabs = ['Browse', 'Upload', 'Estimate', 'Settings']

export default function Navbar() {
  const { user, signout } = useAuthStore()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl z-50 glass-panel px-6 py-3 rounded-2xl items-center justify-between shadow-lg backdrop-blur-2xl border border-white/20 bg-white/10 dark:bg-black/20">
        {/* Page Tabs */}
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <a
              key={tab}
              href={`/${tab.toLowerCase()}`}
              className="text-white/80 hover:text-white font-medium transition"
            >
              {tab}
            </a>
          ))}
        </div>

        {/* Avatar Dropdown */}
        <div className="relative group">
          <button className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/30 focus:outline-none">
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.id || 'user'}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </button>
          <div className="absolute right-0 mt-3 hidden group-hover:flex flex-col bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg p-2 min-w-[180px] shadow-xl">
            <span className="text-xs text-white/70 px-2 py-1">{user?.email}</span>
            <hr className="border-white/20 my-1" />
            <a href="/settings" className="text-sm text-white hover:underline px-2 py-1">
              Settings
            </a>
            <a href="/godmode" className="text-sm text-white hover:underline px-2 py-1">
              GodMode
            </a>
            <button onClick={signout} className="text-sm text-red-400 hover:underline px-2 py-1 text-left">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="sm:hidden fixed inset-0 bg-black/60 z-50">
          <div className="absolute top-0 left-0 w-3/4 h-full bg-white/5 backdrop-blur-2xl border-r border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-semibold text-lg">Menu</span>
              <button onClick={() => setOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {tabs.map((tab) => (
                <a
                  key={tab}
                  href={`/${tab.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white text-base font-medium"
                >
                  {tab}
                </a>
              ))}
              <hr className="my-4 border-white/20" />
              <button
                onClick={() => {
                  signout()
                  setOpen(false)
                }}
                className="text-red-400 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}