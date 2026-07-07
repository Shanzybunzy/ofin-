'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/Button'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()

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
              key={item.id}
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
                  background: 'var(--gray-100)',
                  border: '2px solid var(--black)',
                  borderRadius: 'var(--radius-md)',
                }}
              />

              <div style={{ flexGrow: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  ${item.price.toFixed(2)} each
                </div>
              </div>

              {/* Quantity stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StepBtn
                  label="Decrease quantity"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </StepBtn>
                <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>
                  {item.quantity}
                </span>
                <StepBtn
                  label="Increase quantity"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                onClick={() => removeItem(item.id)}
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
            <Button variant="primary" fullWidth>
              Checkout
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
