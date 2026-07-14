export type SizeOption = {
  label: string // 'S', 'M', 'XL', '2XL', ...
  priceModifier?: number // added to base price for this size; default 0
}

export type Product = {
  id: number
  name: string
  price: number // base price (smallest sizes)
  sizes?: SizeOption[]
  badge?: 'sale' | 'new'
  description?: string
  details?: string[] // spec bullets shown on the product page
  disclaimers?: string[] // small caution notes shown under the specs
  image?: string // path under /public, e.g. '/products/foo.png'
  // Set later, per product, to enable automated Printful fulfillment.
  // See src/lib/printful.ts and FULFILLMENT.md.
  printfulVariantId?: number
}

// Standard tee sizes: S–XL at base price, 2XL–4XL add $2 each.
const STANDARD_SIZES: SizeOption[] = [
  { label: 'S' },
  { label: 'M' },
  { label: 'L' },
  { label: 'XL' },
  { label: '2XL', priceModifier: 2 },
  { label: '3XL', priceModifier: 2 },
  { label: '4XL', priceModifier: 2 },
]

// Fitted tee: adds XS, no 4XL.
const FITTED_SIZES: SizeOption[] = [
  { label: 'XS' },
  { label: 'S' },
  { label: 'M' },
  { label: 'L' },
  { label: 'XL' },
  { label: '2XL', priceModifier: 2 },
  { label: '3XL', priceModifier: 2 },
]

// Spec sheets per garment style.
const CLASSIC_DETAILS: string[] = [
  'Heather colors are 50% cotton, 50% polyester',
  'Fabric weight: 5.0–5.3 oz/yd² (170–180 g/m²)',
  'Pre-shrunk jersey knit',
  'Open-end yarn',
  'Tubular construction',
  'Taped neck and shoulders',
  'Double seam at sleeves and bottom hem',
  'Tear-away tag',
]

const HEAVYWEIGHT_DETAILS: string[] = [
  '100% ring-spun cotton',
  'Fabric weight: 6.1 oz/yd² (206.8 g/m²)',
  'Yarn diameter: 20 singles',
  'Garment-dyed, pre-shrunk fabric',
  'Relaxed fit',
  '7/8″ double-needle topstitched collar',
  'Twill-taped neck and shoulders for extra durability',
  'Double-needle armhole, sleeve, and bottom hems',
  'Signature twill label',
]

const HEAVYWEIGHT_DISCLAIMERS: string[] = [
  'This t-shirt undergoes garment-dyeing and softening processes, which may cause slight color variations.',
]

const FITTED_DETAILS: string[] = [
  '100% ring-spun combed cotton',
  '32 singles',
  'Pre-shrunk',
  'Tear-away tag',
]

// All products share the "thou shall not send" design — three garment styles,
// each in white and black, listed separately. Shipping is charged separately
// at checkout ($5 US / $15 international), so these are item-only prices.
export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Tee — White',
    price: 30,
    sizes: STANDARD_SIZES,
    image: '/products/thou-shall-not-send-white.png',
    description:
      'Classic unisex tee. "where in the Bible does it say thou shall not send" printed on the back, ofin on the front.',
    details: CLASSIC_DETAILS,
    disclaimers: [
      'Due to the fabric properties, the white may appear off-white rather than bright white.',
    ],
  },
  {
    id: 2,
    name: 'Classic Tee — Black',
    price: 30,
    sizes: STANDARD_SIZES,
    image: '/products/thou-shall-not-send-black.png',
    description:
      'Classic unisex tee. "where in the Bible does it say thou shall not send" printed on the back, ofin on the front.',
    details: CLASSIC_DETAILS,
  },
  {
    id: 3,
    name: 'Heavyweight Tee — White',
    price: 44,
    sizes: STANDARD_SIZES,
    image: '/products/garment-dyed-white.png',
    description:
      'Garment-dyed heavyweight tee (Comfort Colors) — thick and vintage-soft. Design on the back, ofin on the front.',
    details: HEAVYWEIGHT_DETAILS,
    disclaimers: HEAVYWEIGHT_DISCLAIMERS,
  },
  {
    id: 4,
    name: 'Heavyweight Tee — Black',
    price: 44,
    sizes: STANDARD_SIZES,
    image: '/products/garment-dyed-black.png',
    description:
      'Garment-dyed heavyweight tee (Comfort Colors) — thick and vintage-soft. Design on the back, ofin on the front.',
    details: HEAVYWEIGHT_DETAILS,
    disclaimers: HEAVYWEIGHT_DISCLAIMERS,
  },
  {
    id: 5,
    name: 'Fitted Tee — White',
    price: 32,
    sizes: FITTED_SIZES,
    image: '/products/fitted-white.png',
    description: 'Slim men’s fitted tee. Design on the back, ofin on the front.',
    details: FITTED_DETAILS,
  },
  {
    id: 6,
    name: 'Fitted Tee — Black',
    price: 32,
    sizes: FITTED_SIZES,
    image: '/products/fitted-black.png',
    description: 'Slim men’s fitted tee. Design on the back, ofin on the front.',
    details: FITTED_DETAILS,
  },
]
