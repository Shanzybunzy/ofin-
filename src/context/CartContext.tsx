'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import type { Product } from '@/lib/products'

export type CartItem = {
  key: string // `${id}::${size}` — a product+size is one line
  id: number
  name: string
  price: number // resolved price for this size (base + size modifier)
  image?: string
  size: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// v2: cart lines now include size, so ignore any older stored cart shape.
const STORAGE_KEY = 'ofin-cart-v2'

function priceForSize(product: Product, size: string): number {
  const option = product.sizes?.find((s) => s.label === size)
  return product.price + (option?.priceModifier ?? 0)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load persisted cart on first mount (client only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // Ignore malformed storage.
    }
    setLoaded(true)
  }, [])

  // Persist whenever the cart changes (after initial load).
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  const addItem = (product: Product, size: string, quantity = 1) => {
    const key = `${product.id}::${size}`
    const price = priceForSize(product, size)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price,
          image: product.image,
          size,
          quantity,
        },
      ]
    })
  }

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(key)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
