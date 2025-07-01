// src/hooks/useModal.js

import { create } from 'zustand'

export const useModal = create((set) => ({
  open: false,
  modalId: null,
  props: {},
  openModal: (id, props = {}) => set({ open: true, modalId: id, props }),
  closeModal: () => set({ open: false, modalId: null, props: {} }),
}))