import { useCallback, useEffect, useState } from 'react'
import { CARDS } from '~/data/cards'
import type { DrawnCard, Spread } from '~/models/reading'
import { secureCoin, shuffle } from '~/utils/random'

const SHUFFLE_MS = 450

function dealFan(size: number): DrawnCard[] {
  return shuffle(CARDS)
    .slice(0, size)
    .map((card) => ({ cardId: card.id, reversed: secureCoin() }))
}

/**
 * 뽑기 화면 상태: 섞은 덱에서 부채꼴로 펼칠 카드들, 고른 순서, 셔플 연출 중 여부.
 * 카드 정체와 방향은 섞을 때 미리 정해지고, 사용자는 뒷면만 보고 고른다.
 */
export function useDraw(initialSpread: Spread) {
  const [fan, setFan] = useState<DrawnCard[]>(() => dealFan(initialSpread.fanSize))
  const [picked, setPicked] = useState<number[]>([])
  const [shuffling, setShuffling] = useState(true)

  useEffect(() => {
    if (!shuffling) return
    const timer = setTimeout(() => setShuffling(false), SHUFFLE_MS)
    return () => clearTimeout(timer)
  }, [shuffling])

  const reshuffle = useCallback((spread: Spread) => {
    setFan(dealFan(spread.fanSize))
    setPicked([])
    setShuffling(true)
  }, [])

  const togglePick = useCallback((index: number, max: number) => {
    setPicked((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index)
      if (prev.length >= max) return prev
      return [...prev, index]
    })
  }, [])

  const pickedCards = picked.map((i) => fan[i])
  return { fan, picked, pickedCards, shuffling, reshuffle, togglePick }
}
