import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/lib/products'

type CartLine = { id: number; size?: string; quantity: number }

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
  // Collect the ordered lines alongside so the order metadata always matches
  // exactly what was charged (skipped/unknown products are excluded from both).
  const lineItems = []
  const orderedLines: CartLine[] = []
  const summaryParts: string[] = [] // human-readable, e.g. "2x Classic Tee — White (M)"
  for (const line of lines) {
    const product = products.find((p) => p.id === line.id)
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 0))
    if (!product) continue

    // Resolve the size server-side so the price (base + size upcharge) and the
    // label can't be tampered with by the browser.
    const sizeOption = product.sizes?.find((s) => s.label === line.size)
    // If this product has sizes, require a valid one.
    if (product.sizes && product.sizes.length > 0 && !sizeOption) continue
    const unitPrice = product.price + (sizeOption?.priceModifier ?? 0)
    // Label carries style + color (product name) and size, so the order is
    // unambiguous for manual Printful fulfillment.
    const label = sizeOption
      ? `${product.name} (${sizeOption.label})`
      : product.name

    lineItems.push({
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(unitPrice * 100), // cents
        product_data: { name: label },
      },
    })
    orderedLines.push({ id: product.id, size: sizeOption?.label, quantity })
    summaryParts.push(`${quantity}x ${label}`)
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
    // Flat-rate shipping. Stripe's hosted page collects the address itself, so
    // it can't auto-pick by country — both options are shown and the shopper
    // selects the one that matches their region.
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 500, currency: 'usd' }, // $5
          display_name: 'US shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1500, currency: 'usd' }, // $15
          display_name: 'International shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 7 },
            maximum: { unit: 'business_day', value: 21 },
          },
        },
      },
    ],
    // Carries our internal product IDs into the paid order so the webhook (and
    // future Printful automation) knows exactly what was bought. Compact
    // "id:size:qty|id:size:qty" format — Stripe caps metadata values at 500
    // chars, which JSON would exceed on large mixed-size carts.
    metadata: {
      cart: orderedLines
        .map((l) => `${l.id}:${l.size ?? ''}:${l.quantity}`)
        .join('|'),
    },
    // Human-readable summary on the payment itself, so exactly what to order in
    // Printful (style + color + size + qty) is visible at a glance in the
    // Stripe dashboard — no need to open the line items.
    payment_intent_data: {
      description: summaryParts.join('; ').slice(0, 1000),
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  })

  return NextResponse.json({ url: session.url })
}
