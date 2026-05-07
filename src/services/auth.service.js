import { mockUsers } from '../mock/mockData'
import { generateId } from '../utils/helpers'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Auth uses sessionStorage (NOT localStorage) so each browser tab maintains
 * its own independent session. This means:
 *  - Teacher in tab 1, Principal in tab 2 — reload in either tab stays correct.
 *  - Logging out in one tab does NOT log out other tabs.
 *
 * Content data (contentStore) intentionally stays in localStorage so
 * approvals/uploads are shared across all tabs in real time.
 */
const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

export const authService = {
  /**
   * Authenticate a user with email and password.
   * Stores the session in sessionStorage (tab-isolated).
   */
  async login(email, password) {
    await delay(1000)

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      throw new Error('Invalid email or password. Please try again.')
    }

    const token = `mock_jwt_${generateId()}`
    const { password: _, ...safeUser } = user

    // sessionStorage: per-tab, survives page reload, cleared on tab close
    sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser))

    return { user: safeUser, token }
  },

  /**
   * Logout the current user.
   * Only clears this tab's session — other tabs are unaffected.
   */
  async logout() {
    await delay(300)
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
  },

  /**
   * Get the currently authenticated user from this tab's sessionStorage.
   */
  getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(AUTH_USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  /**
   * Check if a valid session exists in this tab.
   */
  isAuthenticated() {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
    const user = this.getCurrentUser()
    return !!(token && user)
  },
}
