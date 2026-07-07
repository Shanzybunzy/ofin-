'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import type { Product } from '@/lib/products'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Image frame — swap gray placeholder for real product art later */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          background: 'var(--gray-100)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--black)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-xs)',
        }}
      >
        image
        {product.badge && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge tone={product.badge}>
              {product.badge === 'sale' ? 'Sale' : 'New'}
            </Badge>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {product.name}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      <Button variant={added ? 'secondary' : 'primary'} fullWidth onClick={handleAdd}>
        {added ? 'Added ✓' : 'Add to cart'}
      </Button>
    </div>
  )
}
