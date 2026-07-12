'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import type { Product } from '@/lib/products'

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const href = `/shop/${product.id}`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Image links to the product page */}
      <Link
        href={href}
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          background: product.image ? 'var(--white)' : 'var(--gray-100)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--black)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-xs)',
          textDecoration: 'none',
        }}
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }}
          />
        ) : (
          'image'
        )}
        {product.badge && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge tone={product.badge}>
              {product.badge === 'sale' ? 'Sale' : 'New'}
            </Badge>
          </div>
        )}
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link
          href={href}
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textDecoration: 'none',
          }}
        >
          {product.name}
        </Link>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
          ${product.price.toFixed(2)}
        </span>
      </div>

      <Button variant="primary" fullWidth onClick={() => router.push(href)}>
        Choose size
      </Button>
    </div>
  )
}
