# Fulfillment — how orders get made & shipped

Right now fulfillment is **manual**: you place each paid order into Printful yourself.
The code already has the seam for **automated** fulfillment later, so switching over is a
small change, not a rewrite.

---

## Manual fulfillment (current)

You don't need any integration for this — Stripe already captures everything.

### One-time setup
1. In Stripe, turn on email alerts so you know when an order comes in:
   **Stripe Dashboard → Settings → Business → Customer emails / Notifications** →
   enable notifications for successful payments (and, if you like, customer receipt emails).

### For each order
1. You get a Stripe email (or check **Dashboard → Payments**).
2. Open the payment. You'll see:
   - **What was bought** (line items + quantities)
   - **The shipping address** (collected at checkout)
3. Go to **Printful → Orders → New order**, add the matching product(s), and paste in the
   customer's shipping address.
4. Pay Printful for the item + shipping. They print and ship it to your customer.
5. (Optional) Email the customer their tracking number.

That's it — takes a couple of minutes per order and keeps you in full control.

> The Stripe Dashboard is your source of truth for orders. There's no separate order
> database (intentionally — it keeps hosting simple and free).

---

## Switching to automated fulfillment (later)

When order volume grows, you can have the site send paid orders straight to Printful with
no manual step. The plumbing is already in place:

- `app/api/webhooks/stripe/route.ts` — receives the "payment succeeded" event from Stripe,
  builds the order, and calls `fulfillOrder()`.
- `src/lib/printful.ts` — `fulfillOrder()` currently just logs the order. The exact Printful
  API call is sketched there, commented out.
- Each product carries an optional `printfulVariantId` (`src/lib/products.ts`).

### Checklist to turn it on
1. **Map products:** in Printful, set up your real products, and put each one's Printful
   **variant id** into the matching product's `printfulVariantId` in `src/lib/products.ts`.
2. **Add your Printful key:** set `PRINTFUL_API_KEY` in your environment.
3. **Implement the call:** in `src/lib/printful.ts`, finish `createPrintfulOrder()` (a full
   sketch is already there) and uncomment the `await createPrintfulOrder(order)` line inside
   `fulfillOrder()`.
4. **Register the webhook with Stripe:**
   - Deploy the site first (the webhook needs a public URL).
   - In **Stripe Dashboard → Developers → Webhooks → Add endpoint**, point it at
     `https://YOUR-DOMAIN/api/webhooks/stripe` and subscribe to `checkout.session.completed`.
   - Copy the signing secret Stripe gives you into `STRIPE_WEBHOOK_SECRET`.

### Testing the webhook locally (optional)
The webhook is dormant during normal local browsing. To exercise it on your machine:

```bash
# install the Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the "whsec_..." it prints into STRIPE_WEBHOOK_SECRET, restart the dev server,
# then make a test purchase with card 4242 4242 4242 4242.
```

You'll see the order logged by `fulfillOrder()` in your terminal — proof the seam works
end to end.
