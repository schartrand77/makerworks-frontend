import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModelItem {
  id: string
  name: string
  thumbnailUrl?: string
  volume?: number
  uploadedAt?: string
  price?: number
  quantity: number
  [key: string]: unknown
}

interface CartStoreState {
  items: ModelItem[]

  addItem: (model: ModelItem) => void
  removeItem: (id: string) => void
  clearCart: () => void

  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  setQuantity: (id: string, qty: number) => void

  cartCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (model: ModelItem) => {
        const exists = get().items.find((i) => i.id === model.id)
        if (!exists) {
          console.debug('[CartStore] Adding model:', model)
          set({ items: [...get().items, { ...model, quantity: 1 }] })
        } else {
          console.debug('[CartStore] Model already in cart, increasing quantity:', model.id)
          get().increaseQuantity(model.id)
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

      increaseQuantity: (id: string) => {
        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })
      },

      decreaseQuantity: (id: string) => {
        set({
          items: get().items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })
      },

      setQuantity: (id: string, qty: number) => {
        if (qty <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id
                ? { ...item, quantity: qty }
                : item
            ),
          })
        }
      },

      cartCount: () => {
        const count = get().items.reduce((sum, item) => sum + item.quantity, 0)
        console.debug(`[CartStore] Cart count: ${count}`)
        return count
      },

      subtotal: () => {
        const sum = get()
          .items
          .reduce((acc, item) => acc + ((item.price ?? 0) * item.quantity), 0)
        console.debug(`[CartStore] Subtotal: $${sum.toFixed(2)}`)
        return sum
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)