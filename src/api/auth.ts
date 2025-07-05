// src/api/auth.ts

import axios from './axios'
import { User } from '@/types/user'
import { useAuthStore } from '@/store/useAuthStore';

const BACKEND_LOGIN_URL = '/auth/login'
const CURRENT_USER_URL = `/users/users/me`
const SIGNUP_URL = `/auth/signup`

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

/**
 * Get current authenticated user from backend.
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const res = await axios.get<User>(CURRENT_USER_URL)
    return res.data
  } catch (err) {
    console.error('[Auth] getCurrentUser error:', err)
    throw new Error('Failed to fetch current user')
  }
}

/**
 * Log in via Resource Owner Password Credentials flow (ROPC).
 */
export async function loginWithPassword(
  username: string,
  password: string
): Promise<TokenResponse> {
  try {
    const res = await axios.post<TokenResponse>(BACKEND_LOGIN_URL, {
      username,
      password,
    })
    const tokenData = res.data
    console.debug('[Auth] Received token via backend:', tokenData)
    return tokenData
  } catch (err: any) {
    console.error('[Auth] Failed login via backend:', err)
    throw new Error(err?.response?.data?.detail || 'Login failed')
  }
}

/**
 * Sign up via backend-provided route.
 */
export async function signup({
  email,
  username,
  password,
}: {
  email: string
  username: string
  password: string
}) {
  const res = await fetch(SIGNUP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  })

  return res // caller will .json() or .text()
}

/**
 * Clear auth token from storage.
 */
export function logout() {
  useAuthStore.getState().logout()
}
