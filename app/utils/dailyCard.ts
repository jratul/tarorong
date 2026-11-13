import { CARDS } from '~/data/cards'
import type { DrawnCard } from '~/models/reading'
import { hashString, seededRandom } from './seededRandom'

/** 한국 시간 기준 날짜 'YYYY-MM-DD' */
export function kstDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(date)
}

/** 기기 시드 + 날짜로 정하는 오늘의 카드. 같은 입력이면 항상 같은 카드가 나온다. */
export function pickDailyCard(deviceSeed: string, dateKey: string): DrawnCard {
  const random = seededRandom(hashString(`${deviceSeed}:${dateKey}`))
  const card = CARDS[Math.floor(random() * CARDS.length)]
  return { cardId: card.id, reversed: random() < 0.5 }
}
