import { Link } from 'react-router'
import { TarotCardFace } from '~/components/card/TarotCardFace'
import { CARDS } from '~/data/cards'
import { formatNumber } from '~/utils/formatNumber'
import { pageMeta } from '~/utils/meta'

export const meta = () =>
  pageMeta('카드 도감', '메이저 아르카나 22장과 마이너 아르카나 56장, 타로카드 78장의 의미를 알아봐.')

export default function Cards() {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-baseline gap-3">
        <h1 className="font-display text-3xl text-gold">카드 도감</h1>
        <span className="font-mono text-sm text-cream/60">{formatNumber(CARDS.length)}장</span>
      </header>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {CARDS.map((card) => (
          <li key={card.id}>
            <Link to={`/cards/${card.id}`} className="block transition-transform hover:-translate-y-1">
              <TarotCardFace card={card} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
