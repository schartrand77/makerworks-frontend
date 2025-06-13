import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (item) => set((state) => ({
    cartItems: [...state.cartItems, item]
  })),
  removeFromCart: (model_id) => set((state) => ({
    cartItems: state.cartItems.filter(i => i.model_id !== model_id)
  })),
  clearCart: () => set({ cartItems: [] }),
}))