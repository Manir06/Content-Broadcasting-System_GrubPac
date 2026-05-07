import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PageLoader } from '../components/common/Loader'
import { ROLES } from '../utils/constants'

export function RoleRoute({ allowedRole }) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (user?.role !== allowedRole) {
    // Redirect to the correct dashboard for the user's actual role
    if (user?.role === ROLES.TEACHER) return <Navigate to="/teacher/dashboard" replace />
    if (user?.role === ROLES.PRINCIPAL) return <Navigate to="/principal/dashboard" replace />
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
