import { mockUsers } from '../mock/mockData'
import { generateId } from '../utils/helpers'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))


const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

export const authService = {
  
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

   
    sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser))

    return { user: safeUser, token }
  },


  async logout() {
    await delay(300)
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
  },


  getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(AUTH_USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  isAuthenticated() {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
    const user = this.getCurrentUser()
    return !!(token && user)
  },
}
