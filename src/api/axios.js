import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token from this tab's sessionStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
