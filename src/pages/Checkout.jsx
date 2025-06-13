// src/pages/Checkout.jsx
import { useCartStore } from '../store/cartStore'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { cartItems, clearCart } = useCartStore()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    try {
      const payload = {
        items: cartItems.map((item) => ({
          model_id: item.model_id,
          title: item.title,
          unit_price: Math.round(item.estimated_cost * 100), // Stripe = cents
          quantity: 1
        }))
      }

      const res = await axios.post('/checkout/start', payload)
      window.location.href = res.data.session_url
    } catch (err) {
      console.error(err)
      toast.error('Checkout failed. Please try again.')
    }
  }

  const total = cartItems.reduce((sum, i) => sum + i.estimated_cost, 0).toFixed(2)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/browse')}
          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Browse Models
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-10 text-white bg-gradient-to-b from-black to-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.model_id}
            className="bg-white/10 p-4 rounded-xl border border-white/20 flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-300">
                Size: {item.dims.x}×{item.dims.y}×{item.dims.z} mm
              </p>
              <p className="text-sm text-gray-300">
                Profile: {item.profile} • Filament: {item.filamentType}
              </p>
              <p className="text-sm text-gray-300">
                Est. Time: {item.estimated_time}s • Cost: ${item.estimated_cost.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        <div className="text-lg border-t border-white/20 pt-4">
          <p>Total: <strong>${total}</strong></p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCheckout}
            className="px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            Pay with Stripe
          </button>
          <button
            onClick={clearCart}
            className="px-6 py-3 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}