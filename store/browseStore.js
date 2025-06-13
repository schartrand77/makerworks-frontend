import { create } from 'zustand'

// store/browseStore.js (extend)
export const useBrowseStore = create((set) => ({
  query: '',
  filters: { filament: '', sort: 'newest' },
  page: 1,
  perPage: 8,
  setQuery: (query) => set({ query }),
  setFilter: (key, value) => set((s) => ({
    filters: { ...s.filters, [key]: value }
  })),
  setPage: (page) => set({ page }),
    hoverPreviewEnabled: true,
  togglePreview: () => set((s) => ({ hoverPreviewEnabled: !s.hoverPreviewEnabled })),
}))
