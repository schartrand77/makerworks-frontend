import { useCartStore } from '../stores/cartStore'
import { useEffect, useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import { GlassButton } from '../components/ui/GlassButton'
import toast from 'react-hot-toast'

export default function Checkout() {
  const cart = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const [loading, setLoading] = useState(false)

  const totalCost = cart.reduce((acc, item) => acc + item.price, 0)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_cost: totalCost,
          model_id: cart[0].modelId, // fallback if cart is ever single item
          estimate_id: cart[0].estimateId,
          items: cart.map((item) => ({
            name: item.name,
            model_id: item.modelId,
            estimate_id: item.estimateId,
            price: item.price
          }))
        })
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error('Invalid checkout session')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to start Stripe checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center">🛒 Checkout</h1>

      {cart.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-lg">Your cart is empty.</p>
        </GlassCard>
      ) : (
        <>
          {cart.map((item, i) => (
            <GlassCard key={i} className="flex items-center gap-6 p-6">
              <img src={item.thumbnail} alt={item.name} className="w-32 h-32 object-contain rounded-md" />
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">Estimate ID: {item.estimateId}</p>
                <p className="text-lg font-medium mt-2">${item.price.toFixed(2)}</p>
              </div>
            </GlassCard>
          ))}

          <GlassCard className="flex justify-between items-center p-6 text-lg font-medium">
            <span>Total:</span>
            <span>${totalCost.toFixed(2)}</span>
          </GlassCard>

          <GlassButton onClick={handleCheckout} disabled={loading} className="mx-auto px-8 py-4 text-lg">
            {loading ? 'Redirecting…' : 'Confirm & Pay with Stripe'}
          </GlassButton>
        </>
      )}
    </div>
  )
}