import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 w-64 h-full bg-white border-r border-neutral-200 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="md:pl-64">
        <Header onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="p-4 sm:p-6 md:p-8">
          <Outlet context={{ location, sidebarOpen, setSidebarOpen }} />
        </main>
        <footer className="px-4 sm:px-6 md:px-8 pb-8 pt-2">
          <p className="text-xs text-neutral-400">
            Prototype demo — data demonstrasi (mock) untuk persetujuan client. Belum ada backend, database, atau
            autentikasi.
          </p>
        </footer>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  )
}
