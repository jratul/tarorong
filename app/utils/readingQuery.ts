import { getCard } from '~/data/cards'
import { getSpread, isTopic } from '~/data/spreads'
import type { Reading } from '~/models/reading'

const REVERSED_SUFFIX = '_r'
const MAX_QUESTION = 100

/** 리딩을 결과 화면 URL 쿼리로. 저장하지 않고 URL에 담아 새로고침·공유해도 유지된다. */
export function encodeReading(reading: Reading): string {
  const params = new URLSearchParams()
  params.set('s', reading.spreadId)
  params.set('t', reading.topic)
  params.set('c', reading.cards.map((c) => c.cardId + (c.reversed ? REVERSED_SUFFIX : '')).join(','))
  const question = reading.question?.trim()
  if (question) params.set('q', question.slice(0, MAX_QUESTION))
  return params.toString()
}

/** URL 쿼리를 리딩으로. 스프레드·주제·카드 수·카드 id가 하나라도 맞지 않으면 null */
export function decodeReading(search: string | URLSearchParams): Reading | null {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const spread = getSpread(params.get('s'))
  const topic = params.get('t')
  const raw = params.get('c')
  if (!spread || !isTopic(topic) || !raw) return null

  const cards = raw.split(',').map((token) => {
    const reversed = token.endsWith(REVERSED_SUFFIX)
    return { cardId: reversed ? token.slice(0, -REVERSED_SUFFIX.length) : token, reversed }
  })
  if (cards.length !== spread.positions.length) return null
  if (cards.some((c) => !getCard(c.cardId))) return null
  if (new Set(cards.map((c) => c.cardId)).size !== cards.length) return null

  const question = params.get('q')?.trim().slice(0, MAX_QUESTION) || undefined
  return { spreadId: spread.id, topic, question, cards }
}
