import { useCartStore } from '@/store/useCartStore'
import { ModelItem } from '@/store/useCartStore'

export const useCartItems = () => useCartStore((s) => s.items)

export const useCartCount = () => useCartStore((s) => s.cartCount())

export const useCartSubtotal = () => useCartStore((s) => s.subtotal())

export const useCartSubtotalCents = () => useCartStore((s) => s.subtotal() * 100)

export const useAddItem = () => useCartStore((s) => s.addItem)

export const useRemoveItem = () => useCartStore((s) => s.removeItem)

export const useClearCart = () => useCartStore((s) => s.clearCart)

export const useIncreaseQuantity = () => useCartStore((s) => s.increaseQuantity)

export const useDecreaseQuantity = () => useCartStore((s) => s.decreaseQuantity)

export const useSetQuantity = () => useCartStore((s) => s.setQuantity)