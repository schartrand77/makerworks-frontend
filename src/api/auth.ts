// src/api/auth.ts

import axios from './axios'
import { User } from '@/types/user'

const AUTH_BASE = import.meta.env.VITE_AUTHENTIK_BASE_URL
const CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_AUTH_CLIENT_SECRET

const TOKEN_URL = `${AUTH_BASE}/application/o/token/`
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
  const body = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'openid profile email',
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('[Auth] Failed login:', errText)
    throw new Error(`Login failed: ${errText}`)
  }

  const tokenData: TokenResponse = await res.json()
  console.debug('[Auth] Received token:', tokenData)

  localStorage.setItem('token', tokenData.access_token)
  return tokenData
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
  localStorage.removeItem('token')
}
