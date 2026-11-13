import { useCallback, useState } from 'react'

/** 결과 화면의 카드 뒤집기 상태 */
export function useFlips(count: number) {
  const [flipped, setFlipped] = useState<boolean[]>(() => Array.from({ length: count }, () => false))

  const flip = useCallback((index: number) => {
    setFlipped((prev) => prev.map((v, i) => (i === index ? true : v)))
  }, [])
  const flipAll = useCallback(() => setFlipped((prev) => prev.map(() => true)), [])

  return { flipped, flip, flipAll, allFlipped: flipped.every(Boolean), flippedCount: flipped.filter(Boolean).length }
}
