import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ErrorBoundary } from './components/common/ErrorBoundary'

import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { PageLoader } from './components/common/Loader'
import { ROLES } from './utils/constants'

// Lazy-loaded pages
const Login = lazy(() => import('./pages/auth/Login'))
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'))
const UploadContent = lazy(() => import('./pages/teacher/UploadContent'))
const MyContent = lazy(() => import('./pages/teacher/MyContent'))
const PrincipalDashboard = lazy(() => import('./pages/principal/PrincipalDashboard'))
const PendingApprovals = lazy(() => import('./pages/principal/PendingApprovals'))
const AllContent = lazy(() => import('./pages/principal/AllContent'))
const LiveContent = lazy(() => import('./pages/public/LiveContent'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: 'hsl(222 47% 14%)',
                  border: '1px solid hsl(222 47% 22%)',
                  color: 'hsl(213 31% 91%)',
                },
              }}
            />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public: Live Content (no auth required) */}
                <Route path="/live/:teacherId" element={<LiveContent />} />
                <Route path="/live" element={<LiveContent />} />

                {/* Auth Layout */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    {/* Teacher Routes */}
                    <Route element={<RoleRoute allowedRole={ROLES.TEACHER} />}>
                      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                      <Route path="/teacher/upload" element={<UploadContent />} />
                      <Route path="/teacher/my-content" element={<MyContent />} />
                    </Route>

                    {/* Principal Routes */}
                    <Route element={<RoleRoute allowedRole={ROLES.PRINCIPAL} />}>
                      <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
                      <Route path="/principal/approvals" element={<PendingApprovals />} />
                      <Route path="/principal/all-content" element={<AllContent />} />
                    </Route>
                  </Route>
                </Route>

                {/* Catch-all redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
