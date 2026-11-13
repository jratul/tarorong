import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Longi } from '~/components/longi/Longi'
import { SpeechBubble } from '~/components/longi/LongiGuide'
import { CardFan } from '~/components/reading/CardFan'
import { SpreadSlots } from '~/components/reading/SpreadSlots'
import { Button } from '~/components/ui/Button'
import { Chip } from '~/components/ui/Chip'
import { Panel, SectionTitle } from '~/components/ui/Panel'
import { SPREADS, TOPICS, getSpread } from '~/data/spreads'
import { useDraw } from '~/hooks/useDraw'
import type { Spread, Topic } from '~/models/reading'
import { pageMeta } from '~/utils/meta'
import { encodeReading } from '~/utils/readingQuery'
import type { Route } from './+types/draw'

const DEFAULT_SPREAD = 'three'

export const meta = ({ params }: Route.MetaArgs) => {
  const spread = getSpread(params.spread)
  return pageMeta(spread ? `${spread.name} 뽑기` : '카드 뽑기', spread?.about)
}

// 스프레드는 경로(/draw/celtic)로 정한다. 쿼리(?spread=)로 받으면 prerender된 HTML이 하나뿐이라
// 직접 접속 시 hydration 불일치가 생기므로, 스프레드별 경로를 각각 prerender한다.
export default function Draw({ params }: Route.ComponentProps) {
  const navigate = useNavigate()
  const spread = getSpread(params.spread) ?? getSpread(DEFAULT_SPREAD)!
  // 질문과 역방향 설정은 스프레드를 바꿔도 유지한다
  const [question, setQuestion] = useState('')
  const [allowReversed, setAllowReversed] = useState(true)

  const selectSpread = (next: Spread) => navigate(`/draw/${next.id}`, { replace: true, preventScrollReset: true })

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
      <section className="flex flex-col gap-4 lg:rounded-4xl lg:bg-surface/60 lg:p-6">
        <h1 className="sr-only">카드 뽑기</h1>
        <div className="flex scrollbar-none gap-2 overflow-x-auto" role="group" aria-label="스프레드">
          {SPREADS.map((s) => (
            <Chip key={s.id} active={s.id === spread.id} onClick={() => selectSpread(s)}>
              {s.name}
            </Chip>
          ))}
        </div>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
          placeholder="Q. 마음속 질문을 적어봐 (안 적어도 괜찮아)"
          aria-label="질문"
          className="w-full rounded-2xl bg-sky/12 px-4 py-3 text-sm text-sky placeholder:text-sky/55 focus:outline-2 focus:outline-sky"
        />
        {/* 스프레드가 바뀌면 덱을 새로 섞도록 key로 다시 마운트한다 */}
        <DrawStage key={spread.id} spread={spread} question={question} allowReversed={allowReversed} />
      </section>

      <aside className="flex flex-col gap-4">
        <Panel className="hidden flex-col items-center gap-3 text-center lg:flex">
          <Longi size="md" />
          <SpeechBubble className="rounded-[22px] bg-white/7">
            질문을 마음속으로 떠올리고,
            <br />
            끌리는 카드를 골라줘.
            <br />
            롱이가 잘 섞어뒀어!
          </SpeechBubble>
        </Panel>
        <Panel soft className="flex flex-col gap-2.5">
          <SectionTitle>이 스프레드는</SectionTitle>
          <p className="text-sm leading-relaxed text-cream/70">{spread.about}</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allowReversed}
              onChange={(e) => setAllowReversed(e.target.checked)}
              className="size-4 accent-pink"
            />
            역방향 카드 포함
          </label>
        </Panel>
      </aside>
    </div>
  )
}

function DrawStage({ spread, question, allowReversed }: { spread: Spread; question: string; allowReversed: boolean }) {
  const navigate = useNavigate()
  const [topic, setTopic] = useState<Topic>(spread.fixedTopic ?? 'general')
  const { fan, picked, pickedCards, shuffling, reshuffle, togglePick } = useDraw(spread)
  const need = spread.positions.length
  const left = need - picked.length

  const showResult = () => {
    const cards = pickedCards.map((c) => ({ ...c, reversed: allowReversed && c.reversed }))
    navigate(`/result?${encodeReading({ spreadId: spread.id, topic, question, cards })}`)
  }

  return (
    <>
      {!spread.fixedTopic && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="주제">
          <span className="font-display text-sm text-gold">주제</span>
          {TOPICS.map((t) => (
            <Chip key={t.id} active={t.id === topic} onClick={() => setTopic(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      )}
      <SpreadSlots spread={spread} pickedCount={picked.length} />
      <p className="text-center text-sm text-pink" aria-live="polite">
        {shuffling
          ? '롱이가 카드를 섞는 중…'
          : left > 0
            ? `마음이 끌리는 카드를 ${left}장 골라줘`
            : '좋아, 다 골랐어! 결과 보러 가자'}
      </p>
      <CardFan
        count={fan.length}
        picked={picked}
        max={need}
        shuffling={shuffling}
        onPick={(i) => togglePick(i, need)}
      />
      <div className="flex gap-2 lg:justify-center">
        <Button variant="ghost" className="flex-1 lg:min-w-40 lg:flex-none" onClick={() => reshuffle(spread)}>
          다시 섞기
        </Button>
        <Button className="flex-[1.4] lg:min-w-40 lg:flex-none" disabled={left > 0} onClick={showResult}>
          결과 보기
        </Button>
      </div>
    </>
  )
}
