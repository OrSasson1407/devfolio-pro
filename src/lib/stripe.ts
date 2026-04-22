import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia', 
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '1 portfolio',
      'Default themes',
      '5 AI calls/month',
      'Basic analytics',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited portfolios',
      'All themes',
      'Unlimited AI calls',
      'Full analytics',
      'Custom domain',
    ],
  },
}