import { Link } from 'react-router'
import { TarotCardFace } from '~/components/card/TarotCardFace'
import { getAdjacentCards, getCard } from '~/data/cards'
import { pageMeta } from '~/utils/meta'
import type { Route } from './+types/card-detail'

export const meta = ({ params }: Route.MetaArgs) => {
  const card = getCard(params.id)
  return card
    ? pageMeta(`${card.nameKo} (${card.nameEn})`, `타로카드 ${card.nameKo} 카드의 정방향·역방향 의미를 알아봐.`)
    : pageMeta('카드를 찾을 수 없어')
}

export default function CardDetail({ params }: Route.ComponentProps) {
  const card = getCard(params.id)

  if (!card) {
    return (
      <section className="flex flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-3xl text-gold">그런 카드는 없어</h1>
        <Link to="/cards" className="rounded-full bg-gold px-5 py-2.5 font-display text-ink">
          도감으로
        </Link>
      </section>
    )
  }

  const { prev, next } = getAdjacentCards(card.id)

  return (
    <article className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <TarotCardFace card={card} priority className="w-full max-w-70" />
      <div className="flex w-full max-w-xl flex-col gap-4">
        <span className="font-mono text-sm tracking-wide text-cream/60">
          {card.arcana === 'major' ? 'MAJOR ARCANA' : 'MINOR ARCANA'} · {card.numeral}
        </span>
        <h1 className="font-display text-4xl text-cream">
          {card.nameKo} <span className="text-lg text-cream/60">{card.nameEn}</span>
        </h1>
        <p className="text-cream/70">카드 의미는 곧 채워질 거야.</p>
        <nav className="mt-4 flex justify-between gap-3">
          {prev ? (
            <Link to={`/cards/${prev.id}`} className="rounded-full border border-white/25 px-4 py-2 font-display">
              ‹ {prev.nameKo}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/cards/${next.id}`} className="rounded-full border border-white/25 px-4 py-2 font-display">
              {next.nameKo} ›
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}
