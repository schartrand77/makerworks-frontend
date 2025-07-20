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
  baseURL: `${baseURL}/api/v1`,
  timeout: 15000,
});

// REQUEST INTERCEPTOR
instance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const store = useAuthStore.getState();
    const token =
      store.token ||
      (typeof window !== 'undefined' && window.localStorage?.getItem('token'));

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const label = `[REQ] ${config.method?.toUpperCase() || 'GET'} ${config.url}`;
    console.debug(label);
    if (typeof window !== 'undefined') {
      (window as any).__DEBUG_LOG__?.(label);
    }

    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const label = `[RES] ${response.status} ${response.config.url}`;
    console.debug(label);
    if (typeof window !== 'undefined') {
      (window as any).__DEBUG_LOG__?.(label);
    }
    return response;
  },
  async (error: AxiosError): Promise<never> => {
    const store = useAuthStore.getState();
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
      error.config || {};

    const status = error?.response?.status || 'ERR';
    const url = error?.config?.url || '(unknown URL)';
    const label = `[ERR] ${status} ${url}`;
    console.error(label, error);

    if (typeof window !== 'undefined') {
      (window as any).__DEBUG_LOG__?.(label);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const res = await instance.post('/auth/refresh', {
          refresh_token: store.refreshToken,
        });
        const { token, refresh_token } = res.data;
        useAuthStore.getState().setToken(token, refresh_token);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        console.info('[Axios] Retrying original request after token refresh…');
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('[Axios] Refresh token failed, logging out.', refreshError);
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ React Query fetcher
export const axiosFetcher = <T>(url: string, config?: AxiosRequestConfig) =>
  instance.get<T>(url, config).then((res) => res.data);

export default instance;
