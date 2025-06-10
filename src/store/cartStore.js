import { create } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  clear: () => set({ items: [] }),
}))

removeFromCart: (estimateId) =>
  set((state) => ({
    items: state.items.filter((item) => item.estimateId !== estimateId),
  })),