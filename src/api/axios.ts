// src/api/axios.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3000'

console.debug('[Axios] Using API base URL:', baseURL)

const instance: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
})

interface AuthentikUser {
  email?: string
  username?: string
  groups?: string[]
}

// ✅ Safer localStorage parser
function parseAuthentikUser(): AuthentikUser | null {
  try {
    const raw = localStorage.getItem('authentik_user')
    if (!raw || raw === 'undefined' || raw === 'null') return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

instance.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    const auth = parseAuthentikUser()
    const token = sessionStorage.getItem('access_token')

    config.headers = {
      ...config.headers,
    }

    if (auth?.email && auth?.username) {
      config.headers['X-Authentik-Email'] = auth.email
      config.headers['X-Authentik-Username'] = auth.username
      config.headers['X-Authentik-Groups'] = auth.groups?.join(',') || ''
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    const label = `[REQ] ${config.method?.toUpperCase() || 'GET'} ${config.url}`
    console.debug(label)
    window.__DEBUG_LOG__?.(label)
  } catch (e) {
    console.warn('[Axios] Failed to inject headers:', e)
  }

  return config
})

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const label = `[RES] ${response.status} ${response.config.url}`
    console.debug(label)
    window.__DEBUG_LOG__?.(label)
    return response
  },
  (error: AxiosError): Promise<never> => {
    const status = error?.response?.status || 'ERR'
    const url = error?.config?.url || '(unknown URL)'
    const label = `[ERR] ${status} ${url}`
    console.error(label, error)
    window.__DEBUG_LOG__?.(label)
    return Promise.reject(error)
  }
)

export default instance
