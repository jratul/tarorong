import { CARDS } from '~/data/cards'
import { MEANINGS } from '~/data/meanings'
import type { Suit, TarotCard } from '~/models/card'

export type CardFilter = 'all' | 'major' | Suit

// 이름(한/영)과 정·역방향 키워드를 한 문자열로 묶어 검색한다
const searchText = new Map(
  CARDS.map((card) => {
    const m = MEANINGS[card.id]
    const words = [card.nameKo, card.nameEn, ...(m?.upright.keywords ?? []), ...(m?.reversed.keywords ?? [])]
    return [card.id, words.join(' ').toLowerCase()]
  }),
)

export function matchesFilter(card: TarotCard, filter: CardFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'major') return card.arcana === 'major'
  return card.suit === filter
}

export function searchCards(filter: CardFilter, query: string): TarotCard[] {
  const q = query.trim().toLowerCase()
  return CARDS.filter((card) => matchesFilter(card, filter) && (!q || searchText.get(card.id)?.includes(q)))
}

export function countByFilter(filter: CardFilter): number {
  return CARDS.filter((card) => matchesFilter(card, filter)).length
}
