import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/lib/products'

type CartLine = { id: number; quantity: number }

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Checkout is not configured yet (missing Stripe key).' },
      { status: 500 }
    )
  }

  let lines: CartLine[]
  try {
    const body = await request.json()
    lines = Array.isArray(body.items) ? body.items : []
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
  }

  // Look up each product server-side — never trust prices sent by the browser.
  const lineItems = []
  for (const line of lines) {
    const product = products.find((p) => p.id === line.id)
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 0))
    if (!product) continue
    lineItems.push({
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(product.price * 100), // cents
        product_data: { name: product.name },
      },
    })
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: 'No valid items in cart.' },
      { status: 400 }
    )
  }

  const origin =
    request.headers.get('origin') ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  })

  return NextResponse.json({ url: session.url })
}
