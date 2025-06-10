import { useCartStore } from '../stores/cartStore'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/ui/GlassCard'
import { GlassButton } from '../components/ui/GlassButton'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, removeFromCart, clear } = useCartStore()
  const navigate = useNavigate()

  const total = items.reduce((sum, item) => sum + item.price, 0)

  const handleRemove = (id) => {
    removeFromCart(id)
    toast.success('Removed from cart')
  }

  const handleCheckout = () => {
    if (!items.length) return toast.error('Cart is empty')
    navigate('/checkout')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">🛒 Your Cart</h1>

      {items.length === 0 ? (
        <GlassCard className="text-center py-16">
          <p className="text-lg">Nothing here yet. Add models from the Estimate page.</p>
        </GlassCard>
      ) : (
        <>
          {items.map((item, i) => (
            <GlassCard key={i} className="flex gap-6 items-center p-6">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">Estimate ID: {item.estimateId}</p>
                <p className="text-lg mt-2 font-medium">${item.price.toFixed(2)}</p>
              </div>
              <GlassButton onClick={() => handleRemove(item.estimateId)}>Remove</GlassButton>
            </GlassCard>
          ))}

          <GlassCard className="flex justify-between items-center px-6 py-4 text-lg font-medium">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </GlassCard>

          <div className="flex justify-center gap-4">
            <GlassButton onClick={clear}>Clear All</GlassButton>
            <GlassButton onClick={handleCheckout}>Proceed to Checkout</GlassButton>
          </div>
        </>
      )}
    </div>
  )
}