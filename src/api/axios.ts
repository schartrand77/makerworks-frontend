// src/api/axios.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ||
  'http://localhost:8000';

console.debug('[Axios] Using API base URL:', `${baseURL}/api/v1`);

const instance: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`, // include api/v1 here so all calls are just /auth/signup etc
  // removed withCredentials since we're using Bearer tokens
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
      let token: string | null = null;

      if (typeof window !== 'undefined') {
        token = useAuthStore.getState().token || localStorage.getItem('token');
      }

      if (!config.headers) config.headers = {};

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const label = `[REQ] ${config.method?.toUpperCase() || 'GET'} ${config.url}`;
      console.debug(label);
      window.__DEBUG_LOG__?.(label);
    } catch (e) {
      console.warn('[Axios] Failed to process request config:', e);
    }

    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const label = `[RES] ${response.status} ${response.config.url}`;
    console.debug(label);
    window.__DEBUG_LOG__?.(label);
    return response;
  },
  (error: AxiosError): Promise<never> => {
    const status = error?.response?.status || 'ERR';
    const url = error?.config?.url || '(unknown URL)';
    const label = `[ERR] ${status} ${url}`;
    console.error(label, error);
    window.__DEBUG_LOG__?.(label);
    return Promise.reject(error);
  }
);

export default instance;
