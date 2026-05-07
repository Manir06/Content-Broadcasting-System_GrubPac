import { memo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CheckSquare,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Radio,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { toast } from 'sonner'

const TEACHER_NAV = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard', id: 'nav-teacher-dashboard' },
  { to: '/teacher/upload', icon: Upload, label: 'Upload Content', id: 'nav-teacher-upload' },
  { to: '/teacher/my-content', icon: FileText, label: 'My Content', id: 'nav-teacher-content' },
]

const PRINCIPAL_NAV = [
  { to: '/principal/dashboard', icon: LayoutDashboard, label: 'Dashboard', id: 'nav-principal-dashboard' },
  { to: '/principal/approvals', icon: CheckSquare, label: 'Pending Approvals', id: 'nav-principal-approvals' },
  { to: '/principal/all-content', icon: BookOpen, label: 'All Content', id: 'nav-principal-content' },
]

export const Sidebar = memo(function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === ROLES.TEACHER ? TEACHER_NAV : PRINCIPAL_NAV

  // For teacher: link to their own live page; for principal: generic /live
  const livePageUrl = user?.role === ROLES.TEACHER
    ? `/live/${user?.id}`
    : '/live/teacher-001'

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleOpenLivePage = () => {
    window.open(livePageUrl, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col glass-strong border-r border-border/50 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground">EduCast</span>
              <p className="text-[10px] text-muted-foreground leading-none">Broadcasting System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground p-1 rounded"
            type="button"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
            <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary capitalize">{user?.role}</p>
              <p className="text-[10px] text-muted-foreground">{user?.department ?? 'Portal'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
            Navigation
          </p>
          {navItems.map(({ to, icon: Icon, label, id }) => (
            <NavLink
              key={to}
              to={to}
              id={id}
              onClick={onClose}
              className={({ isActive }) =>
                cn('sidebar-item', isActive && 'active')
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="my-2 border-t border-border/40" />

          {/* Public Live Page Button */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
            Public Access
          </p>
          <button
            type="button"
            onClick={handleOpenLivePage}
            id="nav-live-page"
            className="sidebar-item w-full group relative"
          >
            {/* Pulsing live dot */}
            <span className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
              <Radio className="relative h-4 w-4 text-red-400" />
            </span>
            <span className="flex-1 text-left">Live Broadcast</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </button>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50 space-y-1">
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            type="button"
            id="sidebar-logout"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
})
