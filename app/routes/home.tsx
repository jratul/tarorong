import { Link } from 'react-router'
import { CardBack } from '~/components/card/CardBack'
import { TarotCardFace } from '~/components/card/TarotCardFace'
import { Longi } from '~/components/longi/Longi'
import { SpeechBubble } from '~/components/longi/LongiGuide'
import { ButtonLink } from '~/components/ui/Button'
import { Panel, SectionTitle } from '~/components/ui/Panel'
import { OrientationBadge } from '~/components/reading/ReadingItemCard'
import { SpreadItem } from '~/components/reading/SpreadItem'
import { CARDS } from '~/data/cards'
import { SPREADS } from '~/data/spreads'
import { useDailyCard } from '~/hooks/useDailyCard'
import { formatNumber } from '~/utils/formatNumber'
import { pageMeta } from '~/utils/meta'

export const meta = () => pageMeta()

function dateLabel(dateKey: string) {
  const [, month, day] = dateKey.split('-').map(Number)
  return `${month}월 ${day}일`
}

function TodayCard() {
  const daily = useDailyCard()

  return (
    <Panel className="flex items-center gap-4">
      <div className="w-24 shrink-0">
        {daily ? <TarotCardFace card={daily.card} reversed={daily.reversed} priority /> : <CardBack />}
      </div>
      <div className="flex min-w-0 flex-col items-start gap-2">
        <span className="font-mono text-xs text-sky">{daily ? `${dateLabel(daily.dateKey)} · ` : ''}오늘의 카드</span>
        {daily ? (
          <>
            <h2 className="flex flex-wrap items-center gap-2 font-display text-[19px] leading-tight">
              {daily.card.nameKo} <OrientationBadge reversed={daily.reversed} />
            </h2>
            <p className="text-sm leading-relaxed text-pretty text-cream/85">
              {(daily.reversed ? daily.meaning.reversed : daily.meaning.upright).advice}
            </p>
            <Link to={`/cards/${daily.card.id}`} className="text-xs text-pink hover:text-gold">
              카드 의미 자세히 ›
            </Link>
          </>
        ) : (
          <h2 className="font-display text-[19px] leading-tight">별이 오늘의 카드를 고르는 중…</h2>
        )}
      </div>
    </Panel>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-10">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Longi size="lg" mood="happy" />
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[clamp(32px,4.4vw,52px)] leading-tight">
              안녕, 별빛 친구!
              <br />
              <em className="text-gold not-italic">오늘은 뭐가 궁금해?</em>
            </h1>
            <SpeechBubble>
              오늘 밤 별들이 조금 수다스러워.
              <br />한 장 뽑아서 들어볼래?
            </SpeechBubble>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/draw/one">오늘의 고민 뽑기</ButtonLink>
          <ButtonLink to="/cards" variant="ghost">
            도감 보기 · {formatNumber(CARDS.length)}장
          </ButtonLink>
        </div>
        <TodayCard />
      </section>

      <Panel as="aside" soft className="flex flex-col gap-3">
        <SectionTitle aside={<Link to="/draw">뽑으러 가기 ›</Link>}>스프레드</SectionTitle>
        <div className="flex flex-col gap-2">
          {SPREADS.map((spread) => (
            <SpreadItem key={spread.id} spread={spread} />
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-cream/50">
          타로롱의 해석은 재미와 마음 정리를 위한 거야. 중요한 결정은 너의 생각을 가장 믿어줘.
        </p>
      </Panel>
    </div>
  )
}
