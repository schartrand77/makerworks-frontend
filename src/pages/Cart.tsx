import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import GlassNavbar from '@/components/ui/GlassNavbar'
import { useCartStore } from '@/store/useCartStore'

interface CartItem {
  id: string
  name: string
}

export default function Cart() {
  const { items, removeItem, clearCart } = useCartStore()

  useEffect(() => {
    console.debug('[Cart] Mounted with items:', items)
  }, [items])

  return (
    <>
      <GlassNavbar />
      <PageLayout title="Shopping Cart">
        {items.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your cart is currently empty.
            </p>
          </GlassCard>
        ) : (
          <>
            {items.map((item: CartItem) => (
              <GlassCard key={item.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-zinc-500">ID: {item.id}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </GlassCard>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={clearCart}
                className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-800 text-white text-sm"
              >
                Clear Cart
              </button>
              <button
                onClick={() => console.info('[Cart] Proceed to checkout')}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </PageLayout>
    </>
  )
}