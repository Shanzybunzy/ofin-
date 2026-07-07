export type Product = {
  id: number
  name: string
  price: number
  badge?: 'sale' | 'new'
  description?: string
  // Set later, per product, to enable automated Printful fulfillment.
  // See src/lib/printful.ts and FULFILLMENT.md.
  printfulVariantId?: number
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic White Tee',
    price: 29.99,
    badge: 'new',
    description:
      'A clean white tee with an original ofin design. Soft, everyday, goes with everything.',
  },
  {
    id: 2,
    name: 'Black Crew Neck',
    price: 34.99,
    badge: 'sale',
    description:
      'Heavyweight black crew neck with one original design. Built to be worn out.',
  },
  {
    id: 3,
    name: 'Navy Polo',
    price: 44.99,
    description: 'Navy polo with a subtle ofin mark. A little smarter, still you.',
  },
]
