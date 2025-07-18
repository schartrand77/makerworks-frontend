import axios from './axios';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types/user';

interface SignInResponse {
  user: User;
  token: string;
}

export async function signIn(payload: { email_or_username: string; password: string }): Promise<SignInResponse> {
  const res = await axios.post<SignInResponse>('/auth/signin', payload);
  return res.data;
}

export async function signUp(payload: { email: string; username: string; password: string }): Promise<SignInResponse> {
  const res = await axios.post<SignInResponse>('/auth/signup', payload);
  return res.data;
}

export async function getCurrentUser(): Promise<User> {
  const res = await axios.get<User>('/auth/me');
  const user = res.data;
  useAuthStore.getState().setUser(user);
  return user;
}

export function logout() {
  useAuthStore.getState().logout();
}
