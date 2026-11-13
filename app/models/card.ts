export type Arcana = 'major' | 'minor'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type Orientation = 'upright' | 'reversed'

export interface TarotCard {
  /** 'major-00-fool', 'cups-14-king' — 이미지 파일명과 같다 */
  id: string
  arcana: Arcana
  suit?: Suit
  /** 메이저 0~21, 마이너 1~14 (11~14 = 시종/기사/여왕/왕) */
  number: number
  /** 'XVII', 'A', 'Kn' … */
  numeral: string
  nameKo: string
  nameEn: string
  image: string
}

export interface SuitInfo {
  id: Suit
  nameKo: string
  nameEn: string
  element: string
  /** 결과 요약에서 이 수트가 많이 나왔을 때 쓰는 주제 */
  theme: string
}

/** 카드 한 방향(정/역)의 의미 */
export interface CardSide {
  summary: string
  keywords: string[]
  description: string
  love: string
  work: string
  money: string
  advice: string
}

export interface CardMeaning {
  element: string
  astrology?: string
  /** 롱이의 외우는 팁 */
  tip: string
  upright: CardSide
  reversed: CardSide
}
