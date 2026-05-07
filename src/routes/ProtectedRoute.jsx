import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PageLoader } from '../components/common/Loader'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}
