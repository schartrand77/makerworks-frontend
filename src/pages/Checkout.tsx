import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import PageLayout from '@/components/layout/PageLayout';
import GlassCard from '@/components/ui/GlassCard';
import GlassNavbar from '@/components/ui/GlassNavbar';
import axios from '@/api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''
);

interface CartItem {
  id: string;
  name: string;
  price: number; // assuming price is passed in or mocked here
}

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string }>({
    name: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    document.getElementById('checkout-title')?.focus();
    setTimeout(() => setFormLoading(false), 1000); // simulate initial page load
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0).toFixed(2);

  const handleCheckout = async (): Promise<void> => {
    if (items.length === 0) {
      toast.warning('🛒 Your cart is empty.');
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email.');
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post('/checkout', {
        items,
        customer: formData,
      });

      const stripe = await stripePromise;
      if (!stripe) {
        toast.error('Stripe.js failed to load.');
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
      clearCart();
    } catch (err) {
      console.error('[Checkout] Failed to checkout:', err);
      toast.error('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          <>
            <AnimatePresence>
              {formLoading ? (
                <>
                  {[...Array(2)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <GlassCard>
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2"></div>
                          <div className="h-3 bg-zinc-200 dark:bg-zinc-600 rounded w-1/4"></div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <GlassCard>
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3"></div>
                        <div className="h-10 bg-zinc-200 dark:bg-zinc-600 rounded w-full"></div>
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3 mt-4"></div>
                        <div className="h-10 bg-zinc-200 dark:bg-zinc-600 rounded w-full"></div>
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3 mt-4"></div>
                        <div className="h-20 bg-zinc-200 dark:bg-zinc-600 rounded w-full"></div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </>
              ) : (
                <>
                  {items.map((item: CartItem) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <GlassCard>
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-lg font-semibold">{item.name}</h2>
                            <p className="text-sm text-zinc-500">Model ID: {item.id}</p>
                          </div>
                          <div className="text-sm text-zinc-700 dark:text-zinc-300">
                            ${item.price?.toFixed(2) ?? '0.00'}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}

                  <GlassCard>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full rounded-md border p-2 dark:bg-zinc-800"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full rounded-md border p-2 dark:bg-zinc-800"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-1">
                          Notes (optional)
                        </label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleChange('notes', e.target.value)}
                          className="w-full rounded-md border p-2 dark:bg-zinc-800"
                          placeholder="Any special instructions?"
                          rows={3}
                        />
                      </div>
                    </form>
                  </GlassCard>

                  <GlassCard className="mt-4 text-right">
                    <div className="text-right text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                      <span className="font-semibold">Total:</span> ${total}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCheckout}
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-busy={loading}
                    >
                      {loading ? 'Processing…' : 'Confirm & Pay'}
                    </motion.button>
                  </GlassCard>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </PageLayout>
    </>
  );
}