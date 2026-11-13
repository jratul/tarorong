import type { CardMeaning, CardSide } from '~/models/card'

/** [한 줄 요약, '키워드·키워드·…', 기본 설명, 연애, 일, 금전, 조언] */
export type SideTuple = [string, string, string, string, string, string, string]

function side([summary, keywords, description, love, work, money, advice]: SideTuple): CardSide {
  return { summary, keywords: keywords.split('·'), description, love, work, money, advice }
}

export function meaning(
  element: string,
  astrology: string | undefined,
  tip: string,
  upright: SideTuple,
  reversed: SideTuple,
): CardMeaning {
  return { element, astrology, tip, upright: side(upright), reversed: side(reversed) }
}
