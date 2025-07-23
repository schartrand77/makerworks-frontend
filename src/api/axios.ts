import axios from 'axios'

// ensure baseURL has no trailing slash
const base =
  (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000') + '/api/v1';

const instance = axios.create({
  baseURL: base,
  withCredentials: true,
})

export default instance;
