import { Link } from 'react-router'
import { TarotCardFace } from '~/components/card/TarotCardFace'
import { LongiGuide } from '~/components/longi/LongiGuide'
import { Chip } from '~/components/ui/Chip'
import { SUITS } from '~/data/cards'
import { useCardFilter } from '~/hooks/useCardFilter'
import { type CardFilter, countByFilter } from '~/utils/searchCards'
import { formatNumber } from '~/utils/formatNumber'
import { pageMeta } from '~/utils/meta'

export const meta = () =>
  pageMeta('카드 도감', '메이저 아르카나 22장과 마이너 아르카나 56장, 타로카드 78장의 의미를 알아봐.')

const FILTERS: { id: CardFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'major', label: '메이저' },
  ...SUITS.map((suit) => ({ id: suit.id, label: suit.nameKo })),
]

export default function Cards() {
  const { filter, setFilter, query, setQuery, cards } = useCardFilter()

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
      <aside className="flex flex-col gap-4 lg:sticky lg:top-22">
        <h1 className="font-display text-[28px] text-cream">카드 도감</h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="카드 이름, 키워드로 찾기"
          aria-label="카드 검색"
          className="w-full rounded-2xl bg-sky/12 px-4 py-3 text-sm text-sky placeholder:text-sky/55 focus:outline-2 focus:outline-sky"
        />
        <div className="flex scrollbar-none gap-2 overflow-x-auto lg:flex-col">
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)} className="lg:text-left">
              {f.label} {formatNumber(countByFilter(f.id))}
            </Chip>
          ))}
        </div>
        <div className="hidden lg:block">
          <LongiGuide>카드를 누르면 정방향·역방향 의미를 자세히 볼 수 있어!</LongiGuide>
        </div>
      </aside>

      <section aria-label="카드 목록" className="flex flex-col gap-3">
        <p className="font-mono text-xs text-cream/60">{formatNumber(cards.length)}장</p>
        {cards.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center text-cream/70">
            <p>
              {filter === 'all' ? '' : `${FILTERS.find((f) => f.id === filter)?.label}에서 `}"{query}"에 맞는 카드가
              없어.
            </p>
            {filter !== 'all' && (
              <Chip active onClick={() => setFilter('all')}>
                전체에서 찾아보기
              </Chip>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-x-3 gap-y-4 lg:grid-cols-[repeat(auto-fill,minmax(124px,1fr))] lg:gap-x-4 lg:gap-y-5">
            {cards.map((card, i) => (
              <li key={card.id}>
                <Link
                  to={`/cards/${card.id}`}
                  className="flex flex-col gap-1.5 text-cream transition-transform hover:-translate-y-1"
                >
                  <TarotCardFace card={card} priority={i < 6} />
                  <span className="truncate px-0.5 text-xs text-cream/60">{card.nameEn}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
