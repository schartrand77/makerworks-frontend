import { describe, it, expect, beforeEach, vi } from 'vitest'

function createLocalStorageMock() {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (i: number) => Object.keys(store)[i] || null,
    get length() {
      return Object.keys(store).length
    },
  }
}

describe('useAuthStore.logout', () => {
  let useAuthStore: typeof import('../useAuthStore').useAuthStore

  beforeEach(async () => {
    vi.resetModules()
    vi.stubGlobal('localStorage', createLocalStorageMock())
    ;({ useAuthStore } = await import('../useAuthStore'))
    useAuthStore.setState({ token: 'abc', user: { id: '1', email: 'e', username: 'u', role: 'user' } })
  })

  it('clears auth-storage without stray keys', () => {
    const before = localStorage.getItem('auth-storage')
    expect(before).toBeTruthy()
    useAuthStore.getState().logout()
    expect(localStorage.getItem('token')).toBeNull()
    const persisted = JSON.parse(localStorage.getItem('auth-storage') || '{}')
    expect(persisted.state.token).toBeNull()
    expect(persisted.state.user).toBeNull()
    expect(localStorage.length).toBe(1)
    expect(localStorage.key(0)).toBe('auth-storage')
  })
})
