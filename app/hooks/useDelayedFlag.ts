import { useEffect, useState } from 'react'

/**
 * `key`가 `delay`ms 넘게 그대로 유지될 때만 true. `key`가 null이면 즉시 false.
 *
 * 로딩 표시용. 라우트 청크가 캐시에 있으면 전환이 수십 ms 만에 끝나는데, 그때마다 스피너를 띄우면
 * 깜빡이기만 하니 느릴 때만 보여준다. setState는 타이머 콜백에서만 해서(effect 안 동기 setState 금지 규칙)
 * "어느 key의 타이머가 끝났는지"를 기억하고, 현재 key와 같을 때만 true로 본다.
 */
export function useDelayedFlag(key: string | null, delay = 150): boolean {
  const [firedKey, setFiredKey] = useState<string | null>(null)

  useEffect(() => {
    if (key === null) return
    const timer = setTimeout(() => setFiredKey(key), delay)
    return () => clearTimeout(timer)
  }, [key, delay])

  return key !== null && firedKey === key
}
