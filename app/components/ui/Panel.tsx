import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  soft?: boolean
  as?: 'section' | 'div' | 'aside' | 'article'
}

export function Panel({ soft = false, as: Tag = 'section', className = '', ...rest }: Props) {
  return (
    <Tag
      className={`rounded-[28px] p-5 ${soft ? 'bg-surface/75' : 'bg-surface shadow-float'} ${className}`}
      {...rest}
    />
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <h2 className="flex items-baseline justify-between font-display text-lg text-gold">
      {children}
      {aside && <span className="font-sans text-xs text-cream/60">{aside}</span>}
    </h2>
  )
}
