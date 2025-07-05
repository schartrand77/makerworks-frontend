import { NAV_LINKS } from '@/config/navConfig'
import { useState } from 'react'
import { Menu, X, Shield, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
// import { useCartStore } from '@/store/useCartStore' // optional if cart count + subtotal

const MobileDrawer = () => {
  const [open, setOpen] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false) // ✅ banner
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin' || user?.isAdmin
  const navigate = useNavigate()
  // const cartItems = useCartStore((s) => s.items)
  // const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleCartClick = () => {
    setOpen(false)
    navigate('/cart')
  }

  const handleCheckoutClick = () => {
    setOpen(false)
    navigate('/checkout')
    setCheckoutSuccess(true) // ✅ simulate success
    setTimeout(() => setCheckoutSuccess(false), 5000)
  }

  return (
    <div className="w-full flex justify-between items-center">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col
              backdrop-blur-2xl
              bg-gradient-to-br
              from-white/70 to-white/40
              dark:from-zinc-900/80 dark:to-zinc-800/60
              border-l border-white/10 dark:border-white/20
              text-zinc-900 dark:text-zinc-100
              px-6 py-8 shadow-2xl transition-colors duration-300"
          >
            {/* ✅ Success Banner */}
            <AnimatePresence>
              {checkoutSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-2 mb-4 rounded bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100"
                >
                  <CheckCircle className="w-4 h-4" />
                  Checkout completed successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Navigation
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 flex-grow">
              {NAV_LINKS.map(({ label, href }) => (
                <NavLink
                  key={href}
                  to={href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium rounded-full px-4 py-2 transition-all ${
                      isActive
                        ? 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white'
                        : 'text-zinc-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {/* Uploads explicitly if not in NAV_LINKS */}
              <NavLink
                to="/uploads"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium rounded-full px-4 py-2 transition-all ${
                    isActive
                      ? 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white'
                      : 'text-zinc-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                Uploads
              </NavLink>

              {/* Admin link if admin */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between text-base font-medium rounded-full px-4 py-2 transition-all ${
                      isActive
                        ? 'bg-black/10 dark:bg-white/10 text-blue-600 dark:text-blue-300'
                        : 'text-blue-600 dark:text-blue-300 hover:bg-black/5 dark:hover:bg-white/5'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full">
                    ADMIN
                  </span>
                </NavLink>
              )}
            </nav>

            {/* Subtotal */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-base text-zinc-700 dark:text-zinc-300"
            >
              {/* subtotal: ${subtotal?.toFixed(2) ?? '0.00'} */}
              Subtotal: <strong>$123.45</strong> {/* replace with real subtotal */}
            </motion.div>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleCartClick}
              className="mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white text-base font-medium px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {/* Uncomment below for cart count */}
              {/* {cartItems.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )} */}
            </motion.button>

            {/* Checkout Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleCheckoutClick}
              className="mt-3 flex items-center justify-center gap-2 bg-green-600 text-white text-base font-medium px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition"
            >
              <CreditCard className="w-5 h-5" />
              Checkout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileDrawer