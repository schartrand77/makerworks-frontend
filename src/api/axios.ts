// src/api/axios.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'https://api.makerworks.com'

console.debug('[Axios] Using API base URL:', baseURL)

const instance: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
})

instance.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    config.headers = {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const label = `[REQ] ${config.method?.toUpperCase() || 'GET'} ${config.url}`
    console.debug(label)
    window.__DEBUG_LOG__?.(label)
  } catch (e) {
    console.warn('[Axios] Failed to process request config:', e)
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
