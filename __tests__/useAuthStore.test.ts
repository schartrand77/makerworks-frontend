import { act } from 'react-dom/test-utils'
import axios from '../src/api/axios'
import { useAuthStore } from '../src/store/useAuthStore'
import type { User } from '../src/types/user'

describe('useAuthStore', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'test',
    avatar: 'avatar',
    groups: ['MakerWorks-User'],
  }

  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, godMode: false, resolved: false })
    delete axios.defaults.headers.common['Authorization']
  })

  it('setUser updates user and resolved', () => {
    act(() => {
      useAuthStore.getState().setUser(mockUser)
    })
    expect(useAuthStore.getState().user).toEqual(mockUser)
    expect(useAuthStore.getState().resolved).toBe(true)
  })

  it('setToken manages token and header', () => {
    act(() => {
      useAuthStore.getState().setToken('abc')
    })
    expect(useAuthStore.getState().token).toBe('abc')
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer abc')

    act(() => {
      useAuthStore.getState().setToken(null)
    })
    expect(useAuthStore.getState().token).toBeNull()
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
  })

  it('logout clears user, token and header', () => {
    act(() => {
      useAuthStore.getState().setUser(mockUser)
      useAuthStore.getState().setToken('xyz')
      useAuthStore.getState().setGodMode(true)
    })

    act(() => {
      useAuthStore.getState().logout()
    })
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.godMode).toBe(false)
    expect(state.resolved).toBe(true)
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
  })

  it('isAuthenticated reflects state', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)

    act(() => {
      useAuthStore.getState().setUser(mockUser)
    })
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)

    act(() => {
      useAuthStore.getState().logout()
    })
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)

    act(() => {
      useAuthStore.getState().setGodMode(true)
    })
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)
  })
})
