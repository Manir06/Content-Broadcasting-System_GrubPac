import { memo, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Moon, Sun, User, X, Zap } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/helpers'
import { toast } from 'sonner'

export const Navbar = memo(function Navbar({ onMenuToggle, isDark, onThemeToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = useCallback(async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }, [logout, navigate])

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/50 h-16 flex items-center px-4 gap-4">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary"
        type="button"
        aria-label="Toggle sidebar"
        id="sidebar-toggle"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground mr-auto lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        EduCast
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary"
          type="button"
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications placeholder */}
        <button
          className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary"
          type="button"
          aria-label="Notifications"
          id="notifications-btn"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-secondary transition-colors"
            type="button"
            id="profile-menu-btn"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary text-xs font-bold">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl border border-border/60 shadow-xl shadow-black/30 z-20 py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setIsProfileOpen(false); handleLogout() }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                    type="button"
                    id="logout-btn"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
})
