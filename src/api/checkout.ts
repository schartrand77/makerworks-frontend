import axios from './axios'
import { ModelItem } from '@/store/useCartStore'

export interface CheckoutResponse {
  checkout_url: string
}

export async function createCheckoutSession(items: ModelItem[]): Promise<CheckoutResponse> {
  const res = await axios.post('/checkout', { items })
  return res.data
}
