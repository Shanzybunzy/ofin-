import { products } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default function Shop() {
  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px' }}>
      <h1
        className="font-display"
        style={{ fontSize: 'var(--text-xl)', margin: '0 0 32px' }}
      >
        Shop
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 28,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
