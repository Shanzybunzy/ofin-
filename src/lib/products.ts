export type Product = {
  id: number
  name: string
  price: number
  badge?: 'sale' | 'new'
}

export const products: Product[] = [
  { id: 1, name: 'Classic White Tee', price: 29.99, badge: 'new' },
  { id: 2, name: 'Black Crew Neck', price: 34.99, badge: 'sale' },
  { id: 3, name: 'Navy Polo', price: 44.99 },
]
