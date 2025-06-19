import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.warn('[api] Failed to attach auth token', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

export default api