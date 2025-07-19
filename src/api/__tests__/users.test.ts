import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from '@/api/axios'
import { uploadAvatar, updateUserProfile, deleteAccount } from '../users'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/api/axios')

beforeEach(() => {
  vi.resetAllMocks()
  useAuthStore.setState({ token: 'test-token' } as any)
})

describe('users.ts', () => {
  it('uploads avatar', async () => {
    const fakeRes = { data: { status: 'ok', avatar_url: 'x', thumbnail_url: 'y', uploaded_at: 'now' } }
    ;(axios.post as any).mockResolvedValue(fakeRes)

    const file = new File([''], 'avatar.png')
    const result = await uploadAvatar(file)

    expect(result?.status).toBe('ok')
    expect(axios.post).toHaveBeenCalledWith(
      '/users/avatar',
      expect.any(FormData),
      expect.any(Object)
    )
  })

  it('updates user profile', async () => {
    (axios.patch as any).mockResolvedValue({})

    await expect(
      updateUserProfile({ username: 'valid', email: 'test@example.com' })
    ).resolves.not.toThrow()

    expect(axios.patch).toHaveBeenCalledWith(
      '/users/me',
      expect.objectContaining({ username: 'valid' }),
      expect.any(Object)
    )
  })

  it('throws on invalid profile', async () => {
    await expect(
      updateUserProfile({ email: 'not-an-email' })
    ).rejects.toThrow()
  })

  it('deletes account', async () => {
    (axios.delete as any).mockResolvedValue({})

    await expect(deleteAccount()).resolves.not.toThrow()

    expect(axios.delete).toHaveBeenCalledWith(
      '/users/me',
      expect.any(Object)
    )
  })
})
