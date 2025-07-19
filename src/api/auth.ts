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
  return res.data;
}

/**
 * POST /auth/signup
 */
export async function signUp(payload: { email: string; username: string; password: string }): Promise<SignInResponse> {
  const res = await axios.post<SignInResponse>('/auth/signup', payload);
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
 * Local logout only — clears state.
 * Optional: also call /auth/signout if you implement it.
 */
export function logout() {
  useAuthStore.getState().logout();
}
