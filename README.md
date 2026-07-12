# ofin

i make designs and put them on things.

Online shop for ofin — original designs on shirts. Next.js 15 + TypeScript +
Stripe Checkout, manual Printful fulfillment (automation-ready).

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Checkout needs a Stripe key in `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

In test mode, pay with card `4242 4242 4242 4242`, any future expiry, any CVC.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint

## How it's put together

- `app/` — pages (home, shop, product, cart, checkout success) + API routes
- `src/lib/products.ts` — the product catalog (edit products/prices/sizes here)
- `src/context/CartContext.tsx` — cart state, persisted in the browser
- `app/globals.css` — ofin design tokens (type, color, spacing, shadows)
- `FULFILLMENT.md` — how orders get printed & shipped
