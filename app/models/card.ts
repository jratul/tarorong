export type Arcana = 'major' | 'minor'
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type Topic = 'general' | 'love' | 'work' | 'money'

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
}
