// src/api/axios.ts

import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

// ensure baseURL has no trailing slash
const base =
  (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000') + '/api/v1'

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
    return config
  },
  (error) => Promise.reject(error)
)

export default instance
