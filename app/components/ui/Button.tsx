import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'

type Variant = 'gold' | 'pink' | 'ghost'
type Size = 'md' | 'sm'

const VARIANT: Record<Variant, string> = {
  gold: 'bg-gold text-ink shadow-glow-gold hover:shadow-[0_0_36px_rgb(255_233_166/0.6)]',
  pink: 'bg-pink text-ink hover:bg-[#ffd6ea]',
  ghost: 'bg-surface text-cream hover:bg-[#3a3268]',
}
const SIZE: Record<Size, string> = {
  md: 'px-6.5 py-3.25 text-base',
  sm: 'px-4 py-2 text-sm',
}

function buttonClass(variant: Variant = 'gold', size: Size = 'md', block = false) {
  return `inline-flex items-center justify-center gap-2 rounded-full font-display whitespace-nowrap transition active:scale-97 disabled:pointer-events-none disabled:opacity-40 ${VARIANT[variant]} ${SIZE[size]} ${block ? 'w-full' : ''}`
}

interface StyleProps {
  variant?: Variant
  size?: Size
  block?: boolean
}

export function Button({
  variant,
  size,
  block,
  className = '',
  type = 'button',
  ...rest
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`${buttonClass(variant, size, block)} ${className}`} {...rest} />
}

export function ButtonLink({ variant, size, block, className = '', ...rest }: StyleProps & LinkProps) {
  return <Link className={`${buttonClass(variant, size, block)} ${className}`} {...rest} />
}
