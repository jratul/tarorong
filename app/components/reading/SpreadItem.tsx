import { Link } from 'react-router'
import type { Spread } from '~/models/reading'

const JELLY: Record<Spread['jelly'], string> = {
  gold: 'bg-gold',
  pink: 'bg-pink',
  rose: 'bg-rose',
  sky: 'bg-sky',
}

export function SpreadItem({ spread }: { spread: Spread }) {
  return (
    <Link
      to={`/draw/${spread.id}`}
      className="flex items-center gap-3 rounded-[22px] bg-white/7 px-3.5 py-2.5 text-cream transition hover:bg-white/12"
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-[13px] font-medium text-ink ${JELLY[spread.jelly]}`}
      >
        {spread.positions.length}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display">{spread.name}</span>
        <span className="text-xs text-cream/60">{spread.desc}</span>
      </span>
      <span aria-hidden="true" className="text-cream/50">
        ›
      </span>
    </Link>
  )
}
