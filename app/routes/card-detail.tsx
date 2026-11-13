import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Lightbox } from '~/components/card/Lightbox'
import { TarotCardFace } from '~/components/card/TarotCardFace'
import { LongiGuide } from '~/components/longi/LongiGuide'
import { ButtonLink } from '~/components/ui/Button'
import { KeywordList } from '~/components/ui/Keyword'
import { Panel, SectionTitle } from '~/components/ui/Panel'
import { Segmented } from '~/components/ui/Segmented'
import { SUITS, getAdjacentCards, getCard } from '~/data/cards'
import { getMeaning } from '~/data/meanings'
import type { Orientation } from '~/models/card'
import { pageMeta } from '~/utils/meta'
import type { Route } from './+types/card-detail'

export const meta = ({ params }: Route.MetaArgs) => {
  const card = getCard(params.id)
  if (!card) return pageMeta('카드를 찾을 수 없어')
  const m = getMeaning(card.id)
  return pageMeta(
    `${card.nameKo} (${card.nameEn}) 카드 의미`,
    `${card.nameKo}: ${m.upright.summary}. 정방향 키워드 ${m.upright.keywords.join(', ')} · 역방향 키워드 ${m.reversed.keywords.join(', ')}`,
  )
}

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'upright', label: '정방향' },
  { value: 'reversed', label: '역방향' },
]

export default function CardDetail({ params }: Route.ComponentProps) {
  const card = getCard(params.id)
  const navigate = useNavigate()
  const [orientation, setOrientation] = useState<Orientation>('upright')
  const [zoomed, setZoomed] = useState(false)

  const { prev, next } = card ? getAdjacentCards(card.id) : {}

  if (!card) {
    return (
      <section className="flex flex-col items-center gap-4 pt-16 text-center">
        <h1 className="font-display text-3xl text-gold">그런 카드는 없어</h1>
        <ButtonLink to="/cards">도감으로</ButtonLink>
      </section>
    )
  }

  const m = getMeaning(card.id)
  const reversed = orientation === 'reversed'
  const side = m[orientation]
  const suit = SUITS.find((s) => s.id === card.suit)
  const facts = [
    { label: '원소', value: m.element },
    card.arcana === 'major'
      ? { label: '별자리·행성', value: m.astrology ?? '-' }
      : { label: '수트', value: suit?.nameKo ?? '-' },
    { label: '숫자', value: card.arcana === 'major' ? String(card.number) : card.numeral },
  ]
  const areas = [
    { label: '연애', text: side.love },
    { label: '일', text: side.work },
    { label: '금전', text: side.money },
    { label: '조언', text: side.advice },
  ]

  return (
    <article className="flex flex-col gap-6 lg:grid lg:grid-cols-[340px_1fr] lg:items-start lg:gap-11">
      <section className="flex flex-col items-center gap-4 lg:sticky lg:top-22">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`${card.numeral} ${card.nameKo} 크게 보기`}
          className="w-50 transition-transform hover:-translate-y-1 lg:w-70"
        >
          <TarotCardFace card={card} reversed={reversed} priority />
        </button>
        <Segmented label="카드 방향" options={ORIENTATIONS} value={orientation} onChange={setOrientation} />
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <span className="font-mono text-sm text-sky">
            {card.arcana === 'major' ? 'MAJOR ARCANA' : `MINOR ARCANA · ${suit?.nameEn.toUpperCase()}`} · {card.numeral}
          </span>
          <h1 className="font-display text-[28px] text-cream">
            {card.nameKo} <span className="text-lg text-cream/60">{card.nameEn}</span>
          </h1>
          <p className="text-pink">{side.summary}</p>
        </header>

        <dl className="grid grid-cols-3 gap-2">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5 rounded-2xl bg-white/7 px-3 py-2.5">
              <dt className="text-[11px] text-cream/60">{fact.label}</dt>
              <dd className="font-display text-[15px]">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <Panel className="flex flex-col gap-3">
          <SectionTitle>{reversed ? '역방향' : '정방향'} 키워드</SectionTitle>
          <KeywordList items={side.keywords} />
          <p className="leading-[1.7] text-pretty">{side.description}</p>
        </Panel>

        <section className="flex flex-col gap-3">
          <SectionTitle>상황별 의미</SectionTitle>
          <div className="grid gap-2 lg:grid-cols-2">
            {areas.map((area) => (
              <div key={area.label} className="flex gap-3 rounded-2xl bg-white/7 px-3.5 py-3 text-sm leading-relaxed">
                <b className="w-11 shrink-0 font-display text-[15px] font-normal text-gold">{area.label}</b>
                <span className="text-pretty">{area.text}</span>
              </div>
            ))}
          </div>
        </section>

        <LongiGuide>외우는 팁! {m.tip}</LongiGuide>

        <nav aria-label="다른 카드" className="flex gap-2">
          {prev ? (
            <ButtonLink to={`/cards/${prev.id}`} variant="ghost" className="flex-1">
              ‹ {prev.nameKo}
            </ButtonLink>
          ) : (
            <span className="flex-1" />
          )}
          <ButtonLink to="/cards" variant="pink" className="flex-1">
            도감
          </ButtonLink>
          {next ? (
            <ButtonLink to={`/cards/${next.id}`} variant="ghost" className="flex-1">
              {next.nameKo} ›
            </ButtonLink>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
        <p className="text-center text-xs text-cream/50">
          <Link to="/draw" className="text-pink hover:text-gold">
            이 카드가 나올까? 직접 뽑아보기 ›
          </Link>
        </p>
      </section>

      {zoomed && (
        <Lightbox
          card={card}
          reversed={reversed}
          onClose={() => setZoomed(false)}
          onPrev={prev ? () => navigate(`/cards/${prev.id}`) : undefined}
          onNext={next ? () => navigate(`/cards/${next.id}`) : undefined}
        />
      )}
    </article>
  )
}
