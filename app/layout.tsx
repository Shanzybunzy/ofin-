import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'ofin',
  description: 'i make designs and put them on things.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer
            style={{
              borderTop: '2px solid var(--black)',
              background: 'var(--white)',
              marginTop: 'var(--space-9)',
              padding: '32px',
            }}
          >
            <div
              style={{
                maxWidth: 1120,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <span className="font-display" style={{ fontSize: 24 }}>
                ofin
              </span>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                made in-house, small batch. © {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
