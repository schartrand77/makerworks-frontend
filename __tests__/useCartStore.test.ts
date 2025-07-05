import { act } from 'react-dom/test-utils'
import { useCartStore } from '../src/store/useCartStore'

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('adds an item', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '1', name: 'Test', price: 10, quantity: 1 })
    })
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('increases quantity', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '1', name: 'Test', price: 10, quantity: 1 })
      useCartStore.getState().increaseQuantity('1')
    })
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('decreases quantity and removes at 0', () => {
    act(() => {
      useCartStore.getState().decreaseQuantity('1')
      useCartStore.getState().decreaseQuantity('1')
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('sets quantity', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '2', name: 'Test2', price: 20, quantity: 1 })
      useCartStore.getState().setQuantity('2', 5)
    })
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('computes subtotal', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '3', name: 'Test3', price: 15, quantity: 1 })
      useCartStore.getState().setQuantity('3', 2)
    })
    expect(useCartStore.getState().subtotal()).toBe(30)
  })

  it('computes cart count', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '4', name: 'Test4', price: 5, quantity: 1 })
      useCartStore.getState().setQuantity('4', 2)
    })
    expect(useCartStore.getState().cartCount()).toBe(2)
  })

  it('computes subtotalCents (Stripe-ready)', () => {
    act(() => {
      useCartStore.getState().addItem({ id: '5', name: 'Test5', price: 25, quantity: 1 })
      useCartStore.getState().setQuantity('5', 2)
    })
    expect(useCartStore.getState().subtotal() * 100).toBe(50 * 100)
  })
})