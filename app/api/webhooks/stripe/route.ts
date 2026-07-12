import type Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/lib/products'
import { fulfillOrder, type Order, type OrderItem } from '@/lib/printful'

// Signature verification needs Node's crypto — never the Edge runtime.
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    // Dormant until you set STRIPE_WEBHOOK_SECRET (see FULFILLMENT.md).
    return NextResponse.json(
      { error: 'Webhook not configured.' },
      { status: 500 }
    )
  }

  const signature = request.headers.get('stripe-signature') ?? ''
  const rawBody = await request.text() // must be the raw, unparsed body

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Our internal product IDs + sizes + quantities, stashed at checkout time
    // in compact "id:size:qty|id:size:qty" form (see app/api/checkout/route.ts).
    const raw = session.metadata?.cart ?? ''
    let cart: { id: number; size?: string; quantity: number }[] = []
    if (raw.startsWith('[')) {
      // Fallback for sessions created before the compact format.
      try {
        cart = JSON.parse(raw)
      } catch {
        cart = []
      }
    } else {
      cart = raw
        .split('|')
        .filter(Boolean)
        .map((part) => {
          const [id, size, quantity] = part.split(':')
          return {
            id: Number(id),
            size: size || undefined,
            quantity: Number(quantity) || 1,
          }
        })
    }

    const items: OrderItem[] = cart.map((line) => {
      const product = products.find((p) => p.id === line.id)
      return {
        productId: line.id,
        name: product?.name ?? `Unknown product #${line.id}`,
        size: line.size,
        quantity: line.quantity,
        printfulVariantId: product?.printfulVariantId,
      }
    })

    const shipping = session.shipping_details
    const order: Order = {
      id: session.id,
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
      items,
      shipping: {
        name: shipping?.name ?? null,
        line1: shipping?.address?.line1 ?? null,
        line2: shipping?.address?.line2 ?? null,
        city: shipping?.address?.city ?? null,
        state: shipping?.address?.state ?? null,
        postalCode: shipping?.address?.postal_code ?? null,
        country: shipping?.address?.country ?? null,
      },
    }

    try {
      await fulfillOrder(order)
    } catch (err) {
      // Don't make Stripe retry forever — the order is safe in the Dashboard
      // for manual fulfillment. Revisit error handling when automation is on.
      console.error('[webhook] fulfillOrder failed:', err)
    }
  }

  return NextResponse.json({ received: true })
}
