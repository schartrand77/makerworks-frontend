import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModelItem {
  id: string
  name: string
  thumbnailUrl?: string
  volume?: number
  uploadedAt?: string
  price?: number
  [key: string]: unknown // allow flexible metadata
}

interface CartStoreState {
  items: ModelItem[]
  hydrated: boolean

  addItem: (model: ModelItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,

      addItem: (model: ModelItem) => {
        const exists = get().items.find((i) => i.id === model.id)
        if (!exists) {
          console.debug('[CartStore] Adding model:', model)
          set({ items: [...get().items, model] })
        } else {
          console.debug('[CartStore] Model already in cart:', model.id)
        }
      },

      removeItem: (id: string) => {
        console.debug('[CartStore] Removing model:', id)
        set({ items: get().items.filter((m) => m.id !== id) })
      },

      clearCart: () => {
        console.warn('[CartStore] Clearing cart')
        set({ items: [] })
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => () => set({ hydrated: true }),
    }
  )
)
