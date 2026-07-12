'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/Button'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  async function handleCheckout() {
    setCheckingOut(true)
    setCheckoutError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout.')
      }
      // Hand off to Stripe's secure hosted checkout page.
      window.location.href = data.url
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : 'Something went wrong.'
      )
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 32px' }}>
        <h1
          className="font-display"
          style={{ fontSize: 'var(--text-xl)', margin: '0 0 24px' }}
        >
          Your cart
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Nothing in here yet.
        </p>
        <Link href="/shop">
          <Button variant="primary">Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px' }}>
      <h1
        className="font-display"
        style={{ fontSize: 'var(--text-xl)', margin: '0 0 32px' }}
      >
        Your cart
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* Item list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'var(--bg-surface)',
                border: '2px solid var(--black)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: 16,
              }}
            >
              <div
                style={{
                  height: 72,
                  width: 72,
                  flexShrink: 0,
                  background: item.image ? 'var(--white)' : 'var(--gray-100)',
                  border: '2px solid var(--black)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                  />
                )}
              </div>

              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Size {item.size} · ${item.price.toFixed(2)} each
                </div>
              </div>

              {/* Quantity stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StepBtn
                  label="Decrease quantity"
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                >
                  −
                </StepBtn>
                <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>
                  {item.quantity}
                </span>
                <StepBtn
                  label="Increase quantity"
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                >
                  +
                </StepBtn>
              </div>

              <div
                style={{
                  width: 80,
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeItem(item.key)}
                aria-label="Remove item"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            style={{
              alignSelf: 'flex-start',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              padding: 0,
            }}
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div
          style={{
            background: 'var(--bg-sunken)',
            border: '2px solid var(--black)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            position: 'sticky',
            top: 100,
          }}
        >
          <h2
            className="font-display"
            style={{ fontSize: 'var(--text-md)', margin: '0 0 16px' }}
          >
            Order summary
          </h2>
          <Row label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
          <Row label="Shipping" value="calculated at checkout" muted />
          <div
            style={{
              borderTop: '2px solid var(--black)',
              marginTop: 12,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: 'var(--text-md)',
            }}
          >
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <Button
              variant="primary"
              fullWidth
              disabled={checkingOut}
              onClick={handleCheckout}
            >
              {checkingOut ? 'Redirecting…' : 'Checkout'}
            </Button>
          </div>
          {checkoutError && (
            <p
              style={{
                color: 'var(--accent-600)',
                fontSize: 'var(--text-sm)',
                marginTop: 12,
                marginBottom: 0,
              }}
            >
              {checkoutError}
            </p>
          )}
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
        height: 32,
        width: 32,
        borderRadius: 'var(--radius-pill)',
        border: '2px solid var(--black)',
        background: 'var(--white)',
        color: 'var(--black)',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  )
}

function Row({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
        color: muted ? 'var(--text-muted)' : 'var(--text-secondary)',
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
