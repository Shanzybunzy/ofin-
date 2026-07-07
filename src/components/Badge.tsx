import { CSSProperties, ReactNode } from 'react'

type Tone = 'sale' | 'new' | 'limited' | 'neutral'

const tones: Record<Tone, CSSProperties> = {
  sale: { background: 'var(--tag-sale-bg)', color: 'var(--tag-sale-text)' },
  new: { background: 'var(--tag-new-bg)', color: 'var(--tag-new-text)' },
  limited: { background: 'var(--black)', color: 'var(--white)' },
  neutral: { background: 'var(--gray-100)', color: 'var(--black)' },
}

export default function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: Tone
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        padding: '4px 12px',
        borderRadius: 'var(--radius-pill)',
        border: 'var(--border-width) solid var(--black)',
        lineHeight: 1,
        ...tones[tone],
      }}
    >
      {children}
    </span>
  )
}
