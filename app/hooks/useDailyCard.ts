import { useSyncExternalStore } from 'react'
import { getCard } from '~/data/cards'
import { getMeaning } from '~/data/meanings'
import type { CardMeaning, TarotCard } from '~/models/card'
import { kstDateKey, pickDailyCard } from '~/utils/dailyCard'

const SEED_KEY = 'tarorong:device-seed'

export interface DailyCard {
  dateKey: string
  card: TarotCard
  reversed: boolean
  meaning: CardMeaning
}

/** 기기마다 한 번 만들어 두는 랜덤 시드. 저장할 수 없는 환경이면 빈 문자열(날짜만으로 결정). */
function readDeviceSeed(): string {
  try {
    const saved = localStorage.getItem(SEED_KEY)
    if (saved) return saved
    const seed = crypto.randomUUID()
    localStorage.setItem(SEED_KEY, seed)
    return seed
  } catch {
    return ''
  }
}

let cached: DailyCard | null = null

function getSnapshot(): DailyCard | null {
  const dateKey = kstDateKey()
  if (cached?.dateKey === dateKey) return cached
  const drawn = pickDailyCard(readDeviceSeed(), dateKey)
  const card = getCard(drawn.cardId)
  if (!card) return null
  cached = { dateKey, card, reversed: drawn.reversed, meaning: getMeaning(card.id) }
  return cached
}

const subscribe = () => () => {}
// prerender(빌드 시점)에는 카드를 정하지 않는다 → 날짜가 빌드 날짜로 굳지 않는다
const getServerSnapshot = () => null

/** 오늘의 카드: 기기 시드 + 한국 날짜. 브라우저에서만 계산되고, 그 전에는 null */
export function useDailyCard(): DailyCard | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
