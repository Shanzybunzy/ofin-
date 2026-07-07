'use client'

import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 32px',
        borderBottom: '2px solid var(--black)',
        background: 'var(--white)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <a
        href="/"
        className="font-display"
        style={{
          fontSize: 30,
          color: 'var(--black)',
          textDecoration: 'none',
        }}
      >
        ofin
      </a>

      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          fontFamily: 'var(--font-body)',
        }}
      >
        <a
          href="/shop"
          style={{
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          Shop
        </a>
        <a
          href="/cart"
          style={{
            border: '2px solid var(--black)',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--white)',
            color: 'var(--black)',
            padding: '8px 16px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Cart ({totalItems})
        </a>
      </div>
    </nav>
  )
}
