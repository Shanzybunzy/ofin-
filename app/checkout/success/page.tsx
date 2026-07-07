'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/Button'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()

  // Payment went through — empty the cart so it doesn't linger.
  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '80px 32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '2px solid var(--black)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '48px 32px',
        }}
      >
        <h1
          className="font-display"
          style={{ fontSize: 'var(--text-2xl)', margin: '0 0 16px' }}
        >
          thanks!
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-md)',
            margin: '0 0 32px',
          }}
        >
          Your order is in. You&apos;ll get a confirmation email shortly.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Keep shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
