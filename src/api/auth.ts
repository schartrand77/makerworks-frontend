import axios from './axios';
import { useAuthStore } from '@/store/useAuthStore';
import { UserOut } from '@/types/auth';

interface SignInResponse {
  user: UserOut;
  token: string;
}

/**
 * POST /auth/signin
 */
export async function signIn(payload: { email_or_username: string; password: string }): Promise<SignInResponse> {
  const res = await axios.post<SignInResponse>('/auth/signin', payload);

  const { user, token } = res.data;

  // Save token in localStorage for axios interceptor
  localStorage.setItem('access_token', token);

  // Save user in Zustand store
  useAuthStore.getState().setUser(user);

  return res.data;
}

/**
 * POST /auth/signup
 */
export async function signUp(payload: { email: string; username: string; password: string }): Promise<SignInResponse> {
  const res = await axios.post<SignInResponse>('/auth/signup', payload);

  const { user, token } = res.data;

  localStorage.setItem('access_token', token);
  useAuthStore.getState().setUser(user);

  return res.data;
}

/**
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<UserOut> {
  const res = await axios.get<UserOut>('/auth/me');
  const user = res.data;
  useAuthStore.getState().setUser(user);
  return user;
}

/**
 * Local logout — clears state & token.
 * Optional: also call /auth/signout if backend supports it.
 */
export function logout() {
  localStorage.removeItem('access_token');
  useAuthStore.getState().logout();
}
