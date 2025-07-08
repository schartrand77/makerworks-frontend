// src/api/axios.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://192.168.1.170:49152'

console.debug('[Axios] Using API base URL:', baseURL)

const instance: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true, // let browser send cookies
})

instance.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    config.headers = {
      ...config.headers,
    }

    // optional: log who you think the session is for, if backend sends info
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