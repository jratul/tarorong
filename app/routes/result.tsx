import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { CelticLayout } from '~/components/reading/CelticLayout'
import { LongiSummary } from '~/components/reading/LongiSummary'
import { ReadingItemCard } from '~/components/reading/ReadingItemCard'
import { LongiGuide } from '~/components/longi/LongiGuide'
import { Button, ButtonLink } from '~/components/ui/Button'
import { getSpread, TOPICS } from '~/data/spreads'
import { useFlips } from '~/hooks/useFlips'
import type { Reading } from '~/models/reading'
import { buildItems, summarize } from '~/utils/interpret'
import { pageMeta } from '~/utils/meta'
import { decodeReading } from '~/utils/readingQuery'

export const meta = () => pageMeta('리딩 결과')

export default function Result() {
  const [params] = useSearchParams()
  const key = params.toString()
  const reading = useMemo(() => decodeReading(key), [key])

  if (!reading) {
    return (
      <section className="flex flex-col items-center gap-5 pt-16 text-center">
        <h1 className="font-display text-3xl text-gold">결과를 찾을 수 없어</h1>
        <p className="text-cream/70">링크가 잘못됐거나 카드가 빠졌어. 다시 뽑아볼까?</p>
        <ButtonLink to="/draw">카드 뽑으러 가기</ButtonLink>
      </section>
    )
  }
  // 다른 결과로 바뀌면 뒤집기 상태를 처음부터
  return <ReadingView key={key} reading={reading} />
}

function ReadingView({ reading }: { reading: Reading }) {
  const spread = getSpread(reading.spreadId)!
  const items = useMemo(() => buildItems(reading), [reading])
  const summary = useMemo(() => summarize(items), [items])
  const { flipped, flip, flipAll, allFlipped } = useFlips(items.length)
  const [copied, setCopied] = useState(false)
  const celtic = spread.id === 'celtic'
  const topicLabel = TOPICS.find((t) => t.id === reading.topic)?.label

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
      <section className="flex flex-col gap-5">
        <header className="flex flex-col gap-1">
          <span className="font-mono text-xs text-sky">
            {spread.name} · {spread.desc}
            {topicLabel && !spread.fixedTopic ? ` · ${topicLabel}` : ''}
          </span>
          <h1 className="font-display text-2xl leading-snug text-cream">
            {reading.question ? reading.question : '별이 들려주는 이야기'}
          </h1>
        </header>

        {celtic && <CelticLayout items={items} flipped={flipped} onFlip={flip} />}

        <div className={celtic ? 'flex flex-col gap-3' : 'flex flex-col gap-3 lg:grid lg:grid-cols-3'}>
          {items.map((item, i) => (
            <ReadingItemCard
              key={item.position.key}
              item={item}
              index={i}
              flipped={flipped[i]}
              onFlip={() => flip(i)}
              showCard={!celtic}
            />
          ))}
        </div>
      </section>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-22">
        {allFlipped ? (
          <LongiSummary summary={summary} />
        ) : (
          <>
            <LongiGuide>카드를 모두 뒤집으면 롱이가 한마디 해줄게!</LongiGuide>
            <Button variant="pink" onClick={flipAll}>
              모두 뒤집기
            </Button>
          </>
        )}
        <div className="flex gap-2">
          <ButtonLink to={`/draw/${spread.id}`} variant="ghost" className="flex-1">
            다시 뽑기
          </ButtonLink>
          <Button className="flex-1" onClick={copyLink}>
            {copied ? '복사했어!' : '링크 복사'}
          </Button>
        </div>
        <p className="text-xs leading-relaxed text-cream/50">
          결과는 저장되지 않아. 링크를 복사하면 같은 결과를 다시 볼 수 있어.
        </p>
      </aside>
    </div>
  )
}
