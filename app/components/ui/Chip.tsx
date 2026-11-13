import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ active = false, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3.5 py-2 font-display text-sm transition ${
        active ? 'bg-gold text-ink' : 'bg-white/7 text-cream/80 hover:bg-white/12'
      } ${className}`}
      {...rest}
    />
  )
}
