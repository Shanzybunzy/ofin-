'use client'

import { useState, CSSProperties, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

const sizes: Record<string, CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: 'var(--text-sm)' },
  md: { padding: '12px 22px', fontSize: 'var(--text-base)' },
  lg: { padding: '16px 28px', fontSize: 'var(--text-md)' },
}

const variants: Record<string, CSSProperties> = {
  primary: {
    background: 'var(--cta-bg)',
    color: 'var(--cta-text)',
    border: 'var(--border-width) solid var(--black)',
  },
  secondary: {
    background: 'var(--white)',
    color: 'var(--black)',
    border: 'var(--border-width) solid var(--black)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--black)',
    border: 'var(--border-width) solid transparent',
  },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const style: CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    width: fullWidth ? '100%' : undefined,
    transition:
      'transform var(--duration-fast) var(--ease-pop), box-shadow var(--duration-fast) var(--ease-pop)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...sizes[size],
    ...variants[variant],
    transform: active && !disabled ? 'translate(2px, 2px)' : 'translate(0,0)',
    boxShadow: disabled
      ? 'none'
      : active
        ? '1px 2px 0 rgba(17,17,17,0.9)'
        : 'var(--shadow-sticker)',
    filter: hover && !disabled && !active ? 'brightness(1.05)' : 'none',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setActive(false)
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={style}
    >
      {children}
    </button>
  )
}
