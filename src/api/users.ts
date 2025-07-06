import axios from '@/api/axios'
import { toast } from 'sonner'

export interface AvatarUploadResponse {
  status: 'ok'
  avatar_url: string
  thumbnail_url: string
  uploaded_at: string
}

export interface UpdateProfilePayload {
  username?: string
  email?: string
  bio?: string
  language?: string
  [key: string]: any
}

export const uploadAvatar = async (file: File): Promise<AvatarUploadResponse | null> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await axios.post<AvatarUploadResponse>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Avatar updated.')
    return res.data
  } catch (err: any) {
    console.error('[uploadAvatar] error', err)
    toast.error(err?.response?.data?.detail || 'Failed to upload avatar.')
    return null
  }
}

export const updateUserProfile = async (data: UpdateProfilePayload): Promise<void> => {
  try {
    await axios.patch('/users/me', data)
    toast.success('Profile updated.')
  } catch (err: any) {
    console.error('[updateUserProfile] error', err)
    toast.error(err?.response?.data?.detail || 'Failed to update profile.')
    throw err
  }
}

export const deleteAccount = async (): Promise<void> => {
  try {
    await axios.delete('/users/me')
    toast.success('Account deleted.')
  } catch (err: any) {
    console.error('[deleteAccount] error', err)
    toast.error(err?.response?.data?.detail || 'Failed to delete account.')
    throw err
  }
}