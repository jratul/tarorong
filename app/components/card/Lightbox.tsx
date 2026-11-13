import { useEffect, useEffectEvent, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { TarotCard } from '~/models/card'
import { TarotCardFace } from './TarotCardFace'

interface Props {
  card: TarotCard
  reversed: boolean
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

const WHEEL_GAP_MS = 400

// 카드 확대보기. 조상의 transform에 영향받지 않도록 body에 portal로 그린다.
// ←/→ 와 마우스 휠로 이전·다음, Esc로 닫기.
export function Lightbox({ card, reversed, onClose, onPrev, onNext }: Props) {
  // 휠 연타 방지 시각은 ref에 둔다. 카드가 바뀌어 다시 렌더링돼도 초기화되지 않아야 한 번에 한 장씩 넘어간다.
  const lastWheelAt = useRef(0)

  // 리스너는 한 번만 붙이고, 핸들러는 useEffectEvent로 항상 최신 props를 본다
  const handleKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev?.()
    if (e.key === 'ArrowRight') onNext?.()
  })
  const handleWheel = useEffectEvent((e: WheelEvent) => {
    e.preventDefault()
    const now = Date.now()
    if (now - lastWheelAt.current < WHEEL_GAP_MS) return
    lastWheelAt.current = now
    if (e.deltaY > 0) onNext?.()
    else if (e.deltaY < 0) onPrev?.()
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => handleKey(e)
    const onWheel = (e: WheelEvent) => handleWheel(e)
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  const arrow =
    'flex size-12 items-center justify-center rounded-full bg-white/10 text-2xl text-cream hover:bg-white/20'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${card.nameKo} 크게 보기`}
      className="fixed inset-0 z-50 flex items-center justify-center gap-4 bg-night-deep/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {onPrev && (
        <button type="button" aria-label="이전 카드" className={arrow} onClick={(e) => (e.stopPropagation(), onPrev())}>
          ‹
        </button>
      )}
      <div className="w-[min(78vw,calc(80vh*0.6))]" onClick={(e) => e.stopPropagation()}>
        <TarotCardFace card={card} reversed={reversed} priority />
      </div>
      {onNext && (
        <button type="button" aria-label="다음 카드" className={arrow} onClick={(e) => (e.stopPropagation(), onNext())}>
          ›
        </button>
      )}
      <button
        type="button"
        aria-label="닫기"
        className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-xl text-cream hover:bg-white/20"
        onClick={onClose}
      >
        ✕
      </button>
    </div>,
    document.body,
  )
}
