// src/components/dashboard/CartPreview.jsx
import Button from '@/components/ui/Button'
import { ShoppingCart } from 'lucide-react'

export default function CartPreview({ userId }) {
  const cartItems = [] // TODO: fetch

  const total = '$0.00' // TODO: calculate

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <ShoppingCart size={20} /> Cart Snapshot
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-400 italic mt-2">Your cart is empty.</p>
      ) : (
        <div className="space-y-2 mt-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>
          ))}
          <div className="flex justify-between font-medium border-t border-white/10 pt-2">
            <span>Total</span>
            <span>{total}</span>
          </div>
          <Button className="w-full mt-2">Go to Checkout</Button>
        </div>
      )}
    </div>
  )
}