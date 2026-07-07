import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

if (!secretKey) {
  // Surfaced clearly at request time if the key is missing from .env.local
  console.warn(
    'STRIPE_SECRET_KEY is not set. Add it to .env.local to enable checkout.'
  )
}

export const stripe = new Stripe(secretKey ?? '')
