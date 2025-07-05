import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModelItem {
  id: string
  name: string
  thumbnailUrl?: string
  volume?: number
  uploadedAt?: string
  price: number // in dollars
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
  subtotal: () => number               // in dollars
  subtotalCents: () => number         // ✅ for Stripe
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (model: ModelItem) => {
        const exists = get().items.find((i) => i.id === model.id)
        if (!exists) {
          set({ items: [...get().items, { ...model, quantity: 1 }] })
        } else {
          get().increaseQuantity(model.id)
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((m) => m.id !== id) })
      },

      clearCart: () => {
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
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      subtotal: () => {
        return get()
          .items
          .reduce((acc, item) => acc + item.price * item.quantity, 0)
      },

      subtotalCents: () => {
        return Math.round(get().subtotal() * 100)
      },
    }),
    { name: 'cart-storage' }
  )
)