import type { SuitInfo, TarotCard } from '../models/card'

const MAJORS: [slug: string, numeral: string, nameKo: string, nameEn: string][] = [
  ['fool', '0', '바보', 'The Fool'],
  ['magician', 'I', '마법사', 'The Magician'],
  ['high-priestess', 'II', '여사제', 'The High Priestess'],
  ['empress', 'III', '여황제', 'The Empress'],
  ['emperor', 'IV', '황제', 'The Emperor'],
  ['hierophant', 'V', '교황', 'The Hierophant'],
  ['lovers', 'VI', '연인', 'The Lovers'],
  ['chariot', 'VII', '전차', 'The Chariot'],
  ['strength', 'VIII', '힘', 'Strength'],
  ['hermit', 'IX', '은둔자', 'The Hermit'],
  ['wheel-of-fortune', 'X', '운명의 수레바퀴', 'Wheel of Fortune'],
  ['justice', 'XI', '정의', 'Justice'],
  ['hanged-man', 'XII', '매달린 사람', 'The Hanged Man'],
  ['death', 'XIII', '죽음', 'Death'],
  ['temperance', 'XIV', '절제', 'Temperance'],
  ['devil', 'XV', '악마', 'The Devil'],
  ['tower', 'XVI', '탑', 'The Tower'],
  ['star', 'XVII', '별', 'The Star'],
  ['moon', 'XVIII', '달', 'The Moon'],
  ['sun', 'XIX', '태양', 'The Sun'],
  ['judgement', 'XX', '심판', 'Judgement'],
  ['world', 'XXI', '세계', 'The World'],
]

export const SUITS: SuitInfo[] = [
  { id: 'wands', nameKo: '완드', nameEn: 'Wands', element: '불', theme: '열정과 행동' },
  { id: 'cups', nameKo: '컵', nameEn: 'Cups', element: '물', theme: '감정과 관계' },
  { id: 'swords', nameKo: '소드', nameEn: 'Swords', element: '공기', theme: '생각과 갈등' },
  { id: 'pentacles', nameKo: '펜타클', nameEn: 'Pentacles', element: '흙', theme: '현실과 돈' },
]

const RANKS: [slug: string, numeral: string, nameKo: string, nameEn: string][] = [
  ['ace', 'A', '에이스', 'Ace'],
  ['two', '2', '2', 'Two'],
  ['three', '3', '3', 'Three'],
  ['four', '4', '4', 'Four'],
  ['five', '5', '5', 'Five'],
  ['six', '6', '6', 'Six'],
  ['seven', '7', '7', 'Seven'],
  ['eight', '8', '8', 'Eight'],
  ['nine', '9', '9', 'Nine'],
  ['ten', '10', '10', 'Ten'],
  ['page', 'P', '시종', 'Page'],
  ['knight', 'Kn', '기사', 'Knight'],
  ['queen', 'Q', '여왕', 'Queen'],
  ['king', 'K', '왕', 'King'],
]

const pad = (n: number) => String(n).padStart(2, '0')

export const CARDS: TarotCard[] = [
  ...MAJORS.map(([slug, numeral, nameKo, nameEn], i): TarotCard => {
    const id = `major-${pad(i)}-${slug}`
    return { id, arcana: 'major', number: i, numeral, nameKo, nameEn, image: `/cards/${id}.svg` }
  }),
  ...SUITS.flatMap((suit) =>
    RANKS.map(([slug, numeral, rankKo, rankEn], i): TarotCard => {
      const id = `${suit.id}-${pad(i + 1)}-${slug}`
      return {
        id,
        arcana: 'minor',
        suit: suit.id,
        number: i + 1,
        numeral,
        nameKo: `${suit.nameKo} ${rankKo}`,
        nameEn: `${rankEn} of ${suit.nameEn}`,
        image: `/cards/${id}.svg`,
      }
    }),
  ),
]

const byId = new Map(CARDS.map((card) => [card.id, card]))

export function getCard(id: string | undefined): TarotCard | undefined {
  return id ? byId.get(id) : undefined
}

export function getAdjacentCards(id: string): { prev?: TarotCard; next?: TarotCard } {
  const index = CARDS.findIndex((card) => card.id === id)
  if (index < 0) return {}
  return { prev: CARDS[index - 1], next: CARDS[index + 1] }
}
