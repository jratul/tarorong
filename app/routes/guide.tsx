import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { TarotCardFace } from '~/components/card/TarotCardFace'
import { LongiGuide } from '~/components/longi/LongiGuide'
import { OrientationBadge } from '~/components/reading/ReadingItemCard'
import { ButtonLink } from '~/components/ui/Button'
import { Panel } from '~/components/ui/Panel'
import { CARDS, SUITS, getCard } from '~/data/cards'
import { NUMBER_MEANINGS } from '~/data/combos'
import { COURT_RANKS, GUIDE_SECTIONS, HISTORY, QUESTION_TIPS, REVERSED_WAYS } from '~/data/guide'
import { getMeaning } from '~/data/meanings'
import { SPREADS } from '~/data/spreads'
import { formatNumber } from '~/utils/formatNumber'
import { pageMeta } from '~/utils/meta'

export const meta = () =>
  pageMeta(
    '타로 기초',
    '타로카드는 어디서 왔을까? 15세기 이탈리아에서 시작된 유래, 메이저·마이너 78장의 구성, 수트와 궁정 카드, 역방향 읽는 법까지 쉽게 알려줄게.',
  )

const MAJORS = CARDS.filter((card) => card.arcana === 'major')
const STAR = getCard('major-17-star')!
const STAR_MEANING = getMeaning(STAR.id)

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-22 flex-col gap-4">
      <h2 id={`${id}-title`} className="font-display text-2xl text-gold">
        {title}
      </h2>
      {children}
    </section>
  )
}

const P = ({ children }: { children: ReactNode }) => (
  <p className="leading-[1.8] text-pretty text-cream/90">{children}</p>
)

export default function Guide() {
  const majorCount = formatNumber(MAJORS.length)
  const minorCount = formatNumber(CARDS.length - MAJORS.length)

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-12">
      <nav aria-label="목차" className="lg:sticky lg:top-22">
        <p className="mb-2 font-display text-sm text-cream/60">목차</p>
        <ol className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
          {GUIDE_SECTIONS.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block rounded-full bg-white/7 px-3 py-1.5 text-sm whitespace-nowrap text-cream/80 hover:text-gold lg:rounded-xl lg:bg-transparent lg:px-2"
              >
                <span className="font-mono text-xs text-sky">{i + 1}.</span> {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="flex max-w-3xl min-w-0 flex-col gap-12">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-[clamp(28px,4vw,40px)] leading-tight">
            처음 만나는 <em className="text-gold not-italic">타로 이야기</em>
          </h1>
          <LongiGuide>타로가 처음이어도 괜찮아. 롱이가 차근차근 알려줄게!</LongiGuide>
        </header>

        <Section id="what" title="타로는 뭐야?">
          <P>
            타로는 그림이 그려진 {formatNumber(CARDS.length)}장의 카드야. 카드마다 바보, 별, 탑처럼 이름과 상징이
            있어서, 뽑힌 카드의 그림을 실마리 삼아 지금 내 상황과 마음을 다른 각도에서 바라보게 해줘.
          </P>
          <P>
            미래를 정해주는 주문이라기보다는, 막연한 고민에 이름을 붙이고 생각을 정리하도록 돕는 <b>거울</b>에 가까워.
          </P>
        </Section>

        <Section id="history" title="어디서 왔을까">
          <ol className="flex flex-col gap-4 border-l-2 border-gold/30 pl-5">
            {HISTORY.map((event) => (
              <li key={event.era} className="relative flex flex-col gap-1">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-6.75 size-3 rounded-full bg-gold shadow-glow-gold"
                />
                <span className="font-mono text-sm text-sky">{event.era}</span>
                <h3 className="font-display text-lg">{event.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-cream/80">{event.text}</p>
              </li>
            ))}
          </ol>
          <P>
            정리하면, 타로는 <b>놀이 카드로 태어나 18세기 말부터 점과 성찰의 도구</b>가 된 거야. 고대 이집트에서 왔다는
            이야기는 낭만적이지만 역사적 근거는 없어.
          </P>
        </Section>

        <Section id="structure" title="78장의 구성">
          <div className="grid gap-3 sm:grid-cols-2">
            <Panel className="flex flex-col gap-1.5">
              <h3 className="font-display text-lg text-pink">메이저 아르카나 {majorCount}장</h3>
              <p className="text-sm leading-relaxed text-cream/80">
                0번 바보부터 21번 세계까지. 사랑, 변화, 희망처럼 <b>인생의 큰 주제와 전환점</b>을 이야기해. 많이 나오면
                중요한 시기라는 신호야.
              </p>
            </Panel>
            <Panel className="flex flex-col gap-1.5">
              <h3 className="font-display text-lg text-sky">마이너 아르카나 {minorCount}장</h3>
              <p className="text-sm leading-relaxed text-cream/80">
                4개의 수트 × 14장. 오늘의 다툼, 이번 달 수입처럼 <b>일상에서 일어나는 구체적인 일</b>을 보여줘. 트럼프
                카드의 조상이기도 해.
              </p>
            </Panel>
          </div>

          <h3 className="mt-2 font-display text-lg">네 가지 수트와 원소</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUITS.map((suit) => {
              const ace = CARDS.find((card) => card.suit === suit.id && card.number === 1)!
              return (
                <li key={suit.id}>
                  <Link to={`/cards/${ace.id}`} className="flex flex-col items-center gap-2 text-center">
                    <TarotCardFace card={ace} className="w-24" />
                    <span className="font-display">
                      {suit.nameKo} <span className="text-xs text-cream/60">{suit.nameEn}</span>
                    </span>
                    <span className="text-xs text-cream/70">
                      {suit.element} · {suit.theme}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <h3 className="mt-2 font-display text-lg">숫자 카드 (에이스~10)</h3>
          <P>
            수트마다 에이스(1)부터 10까지 이야기가 이어져. 에이스에서 씨앗이 생기고, 10에서 한 바퀴를 마무리해. 숫자의
            흐름을 알면 처음 보는 카드도 짐작할 수 있어.
          </P>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {Object.entries(NUMBER_MEANINGS).map(([num, text]) => (
              <div key={num} className="flex flex-col rounded-2xl bg-white/7 px-3 py-2">
                <dt className="font-mono text-sm text-gold">{num === '1' ? 'A' : num}</dt>
                <dd className="text-sm">{text}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-2 font-display text-lg">궁정 카드 (시종·기사·여왕·왕)</h3>
          <P>수트마다 네 명의 인물이 있어. 실제 주변 사람을 뜻하기도 하고, 내가 보여야 할 태도를 뜻하기도 해.</P>
          <dl className="grid gap-2 sm:grid-cols-2">
            {COURT_RANKS.map((rank) => (
              <div key={rank.name} className="flex gap-3 rounded-2xl bg-white/7 px-3.5 py-3 text-sm leading-relaxed">
                <dt className="w-14 shrink-0 font-display text-[15px] text-gold">
                  {rank.name}
                  <span className="block font-mono text-[11px] text-cream/50">{rank.en}</span>
                </dt>
                <dd className="text-pretty">{rank.text}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="journey" title="바보의 여정">
          <P>
            메이저 아르카나는 하나의 이야기로 읽기도 해. 0번 <b>바보</b>가 길을 나서서 마법사·여사제 같은 스승을 만나고,
            사랑과 시련(탑), 희망(별)을 지나 21번 <b>세계</b>에서 한 바퀴 여행을 완성하는 거야. 그래서 바보는 번호가
            0이고, 세계 카드 속 춤추는 사람은 여행을 마친 바보라고도 해.
          </P>
          <ol className="-mx-4 flex scrollbar-thin gap-2 overflow-x-auto px-4 pb-2">
            {MAJORS.map((card) => (
              <li key={card.id} className="shrink-0">
                <Link to={`/cards/${card.id}`} className="block w-20 transition-transform hover:-translate-y-1">
                  <TarotCardFace card={card} />
                </Link>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="reversed" title="정방향과 역방향">
          <P>
            카드를 뒤집었을 때 그림이 바로 서 있으면 <b>정방향</b>, 거꾸로 서 있으면 <b>역방향</b>이야. 정방향은 카드의
            기운이 자연스럽게 흐르는 상태고, 역방향은 그 흐름이 어딘가 어긋난 상태로 읽어.
          </P>
          <div className="grid grid-cols-2 gap-4 sm:max-w-md">
            {[false, true].map((reversed) => {
              const side = reversed ? STAR_MEANING.reversed : STAR_MEANING.upright
              return (
                <figure key={String(reversed)} className="flex flex-col items-center gap-2 text-center">
                  <TarotCardFace card={STAR} reversed={reversed} className="w-28" />
                  <figcaption className="flex flex-col items-center gap-1 text-sm">
                    <OrientationBadge reversed={reversed} />
                    {side.summary}
                  </figcaption>
                </figure>
              )
            })}
          </div>
          <h3 className="mt-2 font-display text-lg">역방향을 읽는 네 가지 방법</h3>
          <dl className="grid gap-2 sm:grid-cols-2">
            {REVERSED_WAYS.map((way) => (
              <div key={way.title} className="flex flex-col gap-1 rounded-2xl bg-white/7 px-3.5 py-3">
                <dt className="font-display text-gold">{way.title}</dt>
                <dd className="text-sm leading-relaxed text-pretty">{way.text}</dd>
              </div>
            ))}
          </dl>
          <P>
            역방향을 아예 쓰지 않는 리더도 많아. 타로롱에서는 뽑기 화면에서 <b>역방향 카드 포함</b>을 끄면 모든 카드를
            정방향으로 읽을 수 있어.
          </P>
        </Section>

        <Section id="spreads" title="스프레드">
          <P>
            스프레드는 카드를 놓는 자리와 그 자리의 뜻을 정해둔 배열이야. 같은 카드라도 &lsquo;과거&rsquo; 자리에 나오면
            지난 일로, &lsquo;장애물&rsquo; 자리에 나오면 넘어야 할 벽으로 읽어.
          </P>
          <ul className="grid gap-3 sm:grid-cols-2">
            {SPREADS.map((spread) => (
              <li key={spread.id}>
                <Panel soft className="flex h-full flex-col gap-2">
                  <h3 className="flex items-baseline justify-between font-display text-lg">
                    {spread.name}
                    <span className="font-mono text-xs text-sky">{formatNumber(spread.positions.length)}장</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/80">{spread.about}</p>
                  <p className="text-xs text-cream/60">{spread.positions.map((p) => p.label).join(' · ')}</p>
                  <Link to={`/draw/${spread.id}`} className="mt-auto text-sm text-pink hover:text-gold">
                    {spread.name} 뽑아보기 ›
                  </Link>
                </Panel>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="question" title="질문 잘 하는 법">
          <P>
            타로는 &ldquo;예/아니오&rdquo;보다 <b>&ldquo;어떻게 하면 좋을까&rdquo;</b>에 더 잘 대답해. 결과를 맞히려는
            질문보다 내가 움직일 수 있는 질문으로 바꿔봐.
          </P>
          <ul className="flex flex-col gap-2">
            {QUESTION_TIPS.map((tip) => (
              <li
                key={tip.bad}
                className="flex flex-col gap-1 rounded-2xl bg-white/7 px-4 py-3 text-sm sm:flex-row sm:gap-3"
              >
                <span className="text-cream/50 line-through">{tip.bad}</span>
                <span aria-hidden="true" className="hidden text-cream/40 sm:inline">
                  →
                </span>
                <span className="text-cream">{tip.good}</span>
              </li>
            ))}
          </ul>
          <P>
            같은 질문을 마음에 드는 답이 나올 때까지 반복해서 뽑는 건 피하자. 처음 나온 카드에 담긴 이야기를 먼저
            들어봐.
          </P>
        </Section>

        <Section id="mind" title="타로를 대하는 마음">
          <P>
            타로는 정해진 운명을 알려주는 게 아니라, 지금의 흐름을 비춰주는 이야기야. 좋은 카드가 나오면 힘을 얻고,
            어려운 카드가 나오면 미리 마음의 준비를 하는 정도로 가볍게 즐겨줘. 건강·법률·돈처럼 중요한 결정은 꼭
            전문가와 상의해야 해.
          </P>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/draw/one">한 장 뽑아보기</ButtonLink>
            <ButtonLink to="/cards" variant="ghost">
              카드 도감 보기
            </ButtonLink>
          </div>
        </Section>
      </article>
    </div>
  )
}
