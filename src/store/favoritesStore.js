// store/favoritesStore.js
import { create } from 'zustand'

export const useFavoritesStore = create((set) => ({
  favorites: [],
  setFavorites: (favs) => set({ favorites: favs }),
}))