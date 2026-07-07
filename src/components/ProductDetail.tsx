'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import type { Product } from '@/lib/products'

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px' }}>
      <Link
        href="/shop"
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textDecoration: 'none',
        }}
      >
        ← Back to shop
      </Link>

      <div
        style={{
          display: 'flex',
          gap: 48,
          marginTop: 24,
          flexWrap: 'wrap',
        }}
      >
        {/* Image — swap the gray placeholder for real product art later */}
        <div
          style={{
            flex: '1 1 320px',
            maxWidth: 420,
            aspectRatio: '1 / 1',
            background: 'var(--gray-100)',
            border: '2px solid var(--black)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          image
        </div>

        {/* Details */}
        <div
          style={{
            flex: '1 1 280px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            fontFamily: 'var(--font-body)',
          }}
        >
          {product.badge && (
            <div>
              <Badge tone={product.badge}>
                {product.badge === 'sale' ? 'Sale' : 'New'}
              </Badge>
            </div>
          )}

          <h1
            className="font-display"
            style={{ fontSize: 'var(--text-xl)', margin: 0 }}
          >
            {product.name}
          </h1>

          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
            ${product.price.toFixed(2)}
          </span>

          {product.description && (
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 420,
              }}
            >
              {product.description}
            </p>
          )}

          {/* Quantity */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 8,
            }}
          >
            <span style={{ fontWeight: 600 }}>Qty</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepBtn
                label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </StepBtn>
              <span
                style={{ width: 32, textAlign: 'center', fontWeight: 600 }}
              >
                {quantity}
              </span>
              <StepBtn
                label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </StepBtn>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <Button
              variant={added ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleAdd}
            >
              {added ? 'Added ✓' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        height: 36,
        width: 36,
        borderRadius: 'var(--radius-pill)',
        border: '2px solid var(--black)',
        background: 'var(--white)',
        color: 'var(--black)',
        fontSize: 18,
        fontWeight: 700,
        cursor: 'pointer',
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  )
}
