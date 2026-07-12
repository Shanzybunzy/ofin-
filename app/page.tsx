import Link from 'next/link'
import Button from '@/components/Button'

const features = [
  {
    title: 'Designed by one person',
    body: 'Every design drawn by one person, start to finish.',
  },
  {
    title: 'Original art',
    body: "Designs you won't find anywhere else — put on things you actually want.",
  },
]

export default function Home() {
  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px' }}>
      {/* Hero — one black inverse section, used sparingly for contrast */}
      <section
        style={{
          background: 'var(--bg-inverse)',
          color: 'var(--text-on-inverse)',
          borderRadius: 'var(--radius-lg)',
          padding: '56px 40px',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        <h1
          className="font-display"
          style={{ fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0 }}
        >
          i make designs and
          <br />
          put them on things.
        </h1>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--gray-300)',
            margin: 0,
          }}
        >
          Original artwork on tees, stickers, and more. New drops every Friday.
        </p>
        <div style={{ marginTop: 8 }}>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Shop the drop
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 28,
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--black)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              padding: 28,
            }}
          >
            <h3
              className="font-display"
              style={{ fontSize: 'var(--text-md)', margin: '0 0 8px' }}
            >
              {f.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
