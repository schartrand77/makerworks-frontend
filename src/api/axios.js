// src/api/axios.js

import axios from 'axios'
import { getToken, clearToken } from '@/utils/auth'

// ✅ Extend timeout for slower networks (default is 0 = infinite)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
})

// Request interceptor — attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    return config
  },
  (error) => {
    console.error('[axios] Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor — catch auth errors and CORS/network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      console.warn('[axios] 401 Unauthorized – Invalid or expired token')
      clearToken()
    }

    if (status === 403) {
      console.warn('[axios] 403 Forbidden – Not enough permissions')
    }

    if (!error.response) {
      console.error('[axios] Network error — possible causes:')
 	  console.error('• Backend unreachable (check port forwarding / Docker map)')
 	  console.error('• Invalid API_BASE URL:', import.meta.env.VITE_API_BASE)
 	  console.error('• CORS misconfigured on backend')
 	  console.error('Full error:', error.message || error)
}

    return Promise.reject(error)
  }
)

export default api