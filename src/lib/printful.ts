// Printful fulfillment seam.
//
// Right now fulfillment is MANUAL: when a payment succeeds, you place the order
// in Printful yourself (see FULFILLMENT.md). This module is the single place
// where AUTOMATED Printful fulfillment will plug in later — nothing here calls
// Printful yet.

export type OrderItem = {
  productId: number
  name: string
  quantity: number
  printfulVariantId?: number // set later, per product, to enable automation
}

export type OrderAddress = {
  name: string | null
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
}

export type Order = {
  id: string // Stripe checkout session id
  email: string | null
  amountTotal: number | null // in cents
  currency: string | null
  items: OrderItem[]
  shipping: OrderAddress
}

/**
 * Called by the Stripe webhook after a successful payment.
 *
 * MANUAL MODE (current): logs the order so it's easy to find and place in
 * Printful by hand. The order also lives in your Stripe Dashboard.
 *
 * To switch to AUTOMATED mode later:
 *   1. Set PRINTFUL_API_KEY in your environment.
 *   2. Give each product a `printfulVariantId` in src/lib/products.ts.
 *   3. Implement `createPrintfulOrder` below and uncomment the call.
 */
export async function fulfillOrder(order: Order): Promise<void> {
  console.log('[order] Manual fulfillment — place this order in Printful:')
  console.log(JSON.stringify(order, null, 2))

  // ── AUTOMATED FULFILLMENT (enable later) ──────────────────────────────
  // await createPrintfulOrder(order)
  // ──────────────────────────────────────────────────────────────────────
}

/**
 * FUTURE: create the order in Printful via their API.
 *
 * Sketch of the real implementation (do not enable until products carry
 * `printfulVariantId` and PRINTFUL_API_KEY is set):
 *
 *   const res = await fetch('https://api.printful.com/orders', {
 *     method: 'POST',
 *     headers: {
 *       Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       recipient: {
 *         name: order.shipping.name,
 *         address1: order.shipping.line1,
 *         address2: order.shipping.line2,
 *         city: order.shipping.city,
 *         state_code: order.shipping.state,
 *         zip: order.shipping.postalCode,
 *         country_code: order.shipping.country,
 *       },
 *       items: order.items.map((i) => ({
 *         variant_id: i.printfulVariantId, // required — map every product first
 *         quantity: i.quantity,
 *       })),
 *     }),
 *   })
 *   if (!res.ok) throw new Error(`Printful order failed: ${await res.text()}`)
 */
// export async function createPrintfulOrder(order: Order): Promise<void> {
//   throw new Error('Automated Printful fulfillment not implemented yet.')
// }
