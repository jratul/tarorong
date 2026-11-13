import type { CardSide, TarotCard } from './card'

export type Topic = 'general' | 'love' | 'work' | 'money'

export interface SpreadPosition {
  key: string
  label: string
  description: string
}

export interface Spread {
  id: string
  name: string
  desc: string
  /** 스프레드 설명 (뽑기 화면 옆 패널) */
  about: string
  /** 부채꼴로 펼칠 카드 수 */
  fanSize: number
  /** 주제가 정해진 스프레드(연애운)면 그 주제 */
  fixedTopic?: Topic
  jelly: 'gold' | 'pink' | 'rose' | 'sky'
  positions: SpreadPosition[]
}

export interface DrawnCard {
  cardId: string
  reversed: boolean
}

export interface Reading {
  spreadId: string
  topic: Topic
  question?: string
  cards: DrawnCard[]
}

export interface ReadingItem {
  position: SpreadPosition
  card: TarotCard
  reversed: boolean
  side: CardSide
  /** 주제에 맞춘 해석 문장 */
  text: string
}

export interface ReadingSummary {
  lines: string[]
  tags: string[]
}

export interface ComboRule {
  cards: [string, string]
  text: string
}
