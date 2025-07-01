import axios from './axios'

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axios.post<{ url: string }>('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data.url
}