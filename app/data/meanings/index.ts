import type { CardMeaning } from '~/models/card'
import { CUPS_MEANINGS } from './cups'
import { MAJOR_MEANINGS } from './major'
import { PENTACLES_MEANINGS } from './pentacles'
import { SWORDS_MEANINGS } from './swords'
import { WANDS_MEANINGS } from './wands'

export const MEANINGS: Record<string, CardMeaning> = {
  ...MAJOR_MEANINGS,
  ...WANDS_MEANINGS,
  ...CUPS_MEANINGS,
  ...SWORDS_MEANINGS,
  ...PENTACLES_MEANINGS,
}

export function getMeaning(cardId: string): CardMeaning {
  const found = MEANINGS[cardId]
  if (!found) throw new Error(`카드 의미가 없어: ${cardId}`)
  return found
}
