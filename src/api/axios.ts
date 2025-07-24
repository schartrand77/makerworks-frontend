// src/api/axios.ts

import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

// Ensure baseURL has no trailing slash
const base =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000'

const instance = axios.create({
  baseURL: base,
  withCredentials: true,
})

instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    // 🔍 Log outgoing requests for debugging
    console.info(`[axios] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)

    return config
  },
  (error) => Promise.reject(error)
)

export default instance
