import api from './axios'

export const signIn = async (email, password) => {
  return api.post('/api/v1/auth/signin', { email, password })
}

export const signUp = async (email, password, username) => {
  return api.post('/api/v1/auth/signup', { email, password, username })
}

export const fetchUserProfile = async () => {
  return api.get('/api/v1/auth/me')
}