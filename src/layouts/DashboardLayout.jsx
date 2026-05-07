import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/common/Sidebar'
import { Navbar } from '../components/common/Navbar'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const toggleTheme = useCallback(() => {
    setIsDark((v) => {
      const next = !v
      document.documentElement.classList.toggle('light', !next)
      return next
    })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={toggleSidebar}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
