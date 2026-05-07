import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser } = await authService.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
