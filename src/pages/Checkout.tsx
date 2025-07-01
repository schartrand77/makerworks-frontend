import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import axios from '@/api/axios'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
}

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    console.debug('[Checkout] Loaded with cart items:', items)
  }, [items])

  const handleCheckout = async (): Promise<void> => {
    console.debug('[Checkout] Initiating checkout with:', items)
    if (items.length === 0) {
      toast.warning('Cart is empty')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/checkout', { items })

      console.info('[Checkout] Checkout response:', response.data)

      toast.success('Checkout session started')
      clearCart()
      console.debug('[Checkout] Cart cleared after success')

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url
      }
    } catch (err) {
      console.error('[Checkout] Failed to checkout:', err)
      toast.error('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Checkout">
      {items.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
        </GlassCard>
      ) : (
        <>
          {items.map((item: CartItem) => (
            <GlassCard key={item.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-zinc-500">Model ID: {item.id}</p>
                </div>
              </div>
            </GlassCard>
          ))}

          <GlassCard className="text-right">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md"
            >
              {loading ? 'Processing…' : 'Confirm & Pay'}
            </button>
          </GlassCard>
        </>
      )}
    </PageLayout>
  )
}