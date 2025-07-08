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

  const handleCheckout = () => {
    console.info('[Cart] Proceed to checkout')
    // TODO: implement actual checkout flow
  }

  return (
    <>
      <GlassNavbar floating={false} />
      <PageLayout>
        {items.length === 0 ? (
          <GlassCard>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 py-6">
              🛒 Your cart is currently empty.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
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
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </GlassCard>
            ))}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button
                onClick={clearCart}
                className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-800 text-white text-sm w-full sm:w-auto"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm w-full sm:w-auto"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </PageLayout>
    </>
  )
}