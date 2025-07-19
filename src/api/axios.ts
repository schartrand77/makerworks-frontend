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

instance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
      const store = useAuthStore.getState();
      const token = store.token || (typeof window !== 'undefined' && localStorage.getItem('token'));

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
  async (error: AxiosError): Promise<never> => {
    const store = useAuthStore.getState();
    const originalRequest: any = error.config;
    const status = error?.response?.status || 'ERR';
    const url = error?.config?.url || '(unknown URL)';
    const label = `[ERR] ${status} ${url}`;
    console.error(label, error);
    window.__DEBUG_LOG__?.(label);

    // Transparent refresh token flow
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
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        console.info('[Axios] Retrying original request after refresh…');
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('[Axios] Refresh token failed, logging out.', refreshError);
        useAuthStore.getState().logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
