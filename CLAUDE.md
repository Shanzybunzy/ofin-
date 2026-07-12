# ofin — online shop

E-commerce storefront for **ofin** ("i make designs and put them on things") —
original designs printed on shirts, sold online. Built with Next.js 15 (App
Router) + TypeScript, styled with the ofin design system (Comic Sans display
type, black/white core, orange accent, sticker borders/shadows — tokens live in
`app/globals.css`).

## What's built and working

- **Shop** — 6 products (3 tee styles × white/black), real photos in
  `public/products/`, data in `src/lib/products.ts`
- **Sizes** — per-product size lists with +$2 upcharges on extended sizes,
  priced server-side at checkout
- **Cart** — React context (`src/context/CartContext.tsx`), persisted to
  localStorage (`ofin-cart-v2`), each product+size is its own line
- **Checkout** — Stripe hosted checkout (`app/api/checkout/route.ts`); prices
  and size upcharges resolved server-side; flat-rate shipping ($5 US / $15
  international); cart stashed in session metadata as `id:size:qty|...`
- **Fulfillment** — manual via Printful for now (see `FULFILLMENT.md`);
  dormant Stripe webhook (`app/api/webhooks/stripe/route.ts`) +
  `src/lib/printful.ts` stub are the seam for automating later

## Key files

| File | Role |
|------|------|
| `src/lib/products.ts` | Product catalog: names, prices, sizes, images |
| `src/context/CartContext.tsx` | Cart state + persistence |
| `app/api/checkout/route.ts` | Creates Stripe Checkout sessions |
| `app/api/webhooks/stripe/route.ts` | Post-payment hook (dormant until secret set) |
| `src/lib/printful.ts` | Fulfillment seam — stub until automation |
| `app/globals.css` | All ofin design tokens |
| `FULFILLMENT.md` | How orders get made & shipped |

## Environment (`.env.local`, never committed)

- `STRIPE_SECRET_KEY` — currently the TEST key
- `NEXT_PUBLIC_BASE_URL` — redirect base for checkout
- `STRIPE_WEBHOOK_SECRET`, `PRINTFUL_API_KEY` — empty until automation

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # production build
npm run lint    # ESLint
npx tsc --noEmit  # typecheck
```

## Remaining before launch

- [ ] Deploy to Vercel (repo: github.com/Shanzybunzy/ofin-)
- [ ] Buy domain (leaning ofin.shop) and point at Vercel
- [ ] Switch Stripe to live mode key in production env
- [ ] Enable Stripe email notifications (new-payment alerts + customer receipts)
- [ ] Set up the products in Printful for manual fulfillment
