import { useCartStore } from '../store/cartStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCartStore()

  const totalCost = cartItems.reduce((acc, item) => acc + item.estimated_cost, 0).toFixed(2)
  const totalTime = cartItems.reduce((acc, item) => acc + item.estimated_time, 0).toFixed(1)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
<Link to="/browse" className="text-blue-400 underline hover:text-blue-200">
  Browse Models
</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-white/80 to-slate-100 dark:from-[#101010] dark:to-[#050505] text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Cart</h1>

      <div className="grid gap-6 max-w-5xl mx-auto">
        {cartItems.map((item) => (
          <div
            key={item.model_id}
            className="flex gap-4 bg-white/10 border border-white/20 rounded-xl p-4 shadow backdrop-blur-md"
          >
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-32 h-32 object-cover rounded-xl border border-white/20"
            />
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-300">Size: {item.dims.x}×{item.dims.y}×{item.dims.z} mm</p>
              <p className="text-sm text-gray-300">Profile: {item.profile}, Filament: {item.filamentType}</p>
              <p className="text-sm text-gray-300">Custom Text: {item.customText || '—'}</p>
              <p className="text-sm text-gray-300">Colors: {item.colors.join(', ')}</p>
              <p className="text-sm text-gray-300">Est. Time: {item.estimated_time}s • Cost: ${item.estimated_cost.toFixed(2)}</p>
            </div>
            <button
              onClick={() => {
                removeFromCart(item.model_id)
                toast.success('Removed from cart')
              }}
              className="text-red-400 hover:text-red-200 self-start text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white/10 rounded-xl border border-white/20 text-lg">
        <p className="mb-2">Total Time: <strong>{totalTime}s</strong></p>
        <p className="mb-4">Total Cost: <strong>${totalCost}</strong></p>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}