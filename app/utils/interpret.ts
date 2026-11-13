import { CARDS, SUITS, getCard } from '~/data/cards'
import { COMBOS, NUMBER_MEANINGS } from '~/data/combos'
import { getMeaning } from '~/data/meanings'
import { getSpread } from '~/data/spreads'
import type { CardSide } from '~/models/card'
import type { Reading, ReadingItem, ReadingSummary, Topic } from '~/models/reading'
import { josa } from './josa'

/** 주제에 맞는 해석 문장. 종합이면 기본 설명을 쓴다. */
export function sideText(side: CardSide, topic: Topic): string {
  switch (topic) {
    case 'love':
      return side.love
    case 'work':
      return side.work
    case 'money':
      return side.money
    default:
      return side.description
  }
}

export function buildItems(reading: Reading): ReadingItem[] {
  const spread = getSpread(reading.spreadId)
  if (!spread) return []
  return reading.cards.flatMap((drawn, i) => {
    const card = getCard(drawn.cardId)
    const position = spread.positions[i]
    if (!card || !position) return []
    const meaning = getMeaning(card.id)
    const side = drawn.reversed ? meaning.reversed : meaning.upright
    return [{ position, card, reversed: drawn.reversed, side, text: sideText(side, reading.topic) }]
  })
}

const COURT_MIN = 11

/** 롱이의 한마디: 뽑힌 카드들을 규칙으로 읽어 요약 문장과 태그를 만든다. */
export function summarize(items: ReadingItem[]): ReadingSummary {
  if (items.length === 0) return { lines: [], tags: [] }
  const last = items[items.length - 1]
  const tags = [...new Set(items.map((item) => item.side.keywords[0]))].slice(0, 4)

  if (items.length === 1) {
    return { lines: [items[0].side.summary + '.', items[0].side.advice], tags: items[0].side.keywords.slice(0, 4) }
  }

  const lines: string[] = []
  const n = items.length
  const majors = items.filter((item) => item.card.arcana === 'major').length
  const reversed = items.filter((item) => item.reversed).length

  if (majors / n >= 0.5) {
    lines.push('메이저 카드가 많이 나왔어. 인생의 큰 흐름이 움직이는 중요한 시기야.')
  } else if (majors === 0) {
    lines.push('메이저 카드 없이 마이너 카드로만 나왔어. 큰 운명보다 네 일상의 선택이 흐름을 만들어.')
  }

  const suitCounts = SUITS.map((suit) => ({ suit, count: items.filter((item) => item.card.suit === suit.id).length }))
  const top = suitCounts.reduce((a, b) => (b.count > a.count ? b : a))
  const tied = suitCounts.filter((s) => s.count === top.count).length > 1
  if (top.count >= 2 && !tied) {
    lines.push(
      `${josa(top.suit.nameKo, '이', '가')} ${top.count}장이야. 지금은 ${josa(top.suit.theme, '이', '가')} 이야기의 중심이야.`,
    )
  }

  if (reversed / n > 0.5) {
    lines.push('역방향이 많아. 어딘가 막혀 있는 마음을 먼저 들여다보면 흐름이 풀려.')
  } else if (reversed === 0 && n >= 3) {
    lines.push('모든 카드가 정방향이야. 막힘 없이 흐름이 이어지고 있어.')
  }

  const courts = items.filter((item) => item.card.arcana === 'minor' && item.card.number >= COURT_MIN).length
  if (courts >= 2) {
    lines.push('궁정 카드가 여러 장이야. 주변 사람들의 영향이 크게 작용하고 있어.')
  }

  const numberCounts = new Map<number, number>()
  for (const item of items) {
    if (item.card.arcana === 'minor' && item.card.number < COURT_MIN) {
      numberCounts.set(item.card.number, (numberCounts.get(item.card.number) ?? 0) + 1)
    }
  }
  for (const [num, count] of numberCounts) {
    if (count >= 2) {
      lines.push(`숫자 ${josa(String(num), '이', '가')} ${count}번 나왔어. '${NUMBER_MEANINGS[num]}'의 기운이 강해.`)
    }
  }

  const ids = new Set(items.map((item) => item.card.id))
  for (const combo of COMBOS) {
    if (combo.cards.every((id) => ids.has(id))) lines.push(combo.text)
  }

  lines.push(`마지막 '${last.position.label}' 자리의 조언이야. ${last.side.advice}`)
  return { lines, tags }
}

/** 해석 데이터가 모든 카드에 있는지 확인용 */
export function missingMeanings(): string[] {
  return CARDS.filter((card) => {
    try {
      getMeaning(card.id)
      return false
    } catch {
      return true
    }
  }).map((card) => card.id)
}
