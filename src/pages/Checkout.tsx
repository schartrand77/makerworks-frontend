import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import PageLayout from '@/components/layout/PageLayout'
import GlassCard from '@/components/ui/GlassCard'
import GlassNavbar from '@/components/ui/GlassNavbar'
import axios from '@/api/axios'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''
)

interface CartItem {
  id: string
  name: string
}

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // Focus the page title for accessibility
    document.getElementById('checkout-title')?.focus()
  }, [])

  const handleCheckout = async (): Promise<void> => {
    if (items.length === 0) {
      toast.warning('Cart is empty')
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.post('/checkout', { items })

      const stripe = await stripePromise
      if (!stripe) {
        toast.error('Stripe.js failed to load')
        return
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId })
      clearCart()
    } catch (err) {
      console.error('[Checkout] Failed to checkout:', err)
      toast.error('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <GlassNavbar />
      <PageLayout title="Checkout" id="checkout">
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
    </>
  )
}