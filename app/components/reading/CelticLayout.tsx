import { FlipCard } from '~/components/card/FlipCard'
import type { ReadingItem } from '~/models/reading'

interface Props {
  items: ReadingItem[]
  flipped: boolean[]
  onFlip: (index: number) => void
}

// 켈틱 크로스 배치: 왼쪽 십자(1~6) + 오른쪽 기둥(7~10, 아래에서 위로). 좌표는 카드 중심의 %.
const SLOTS: { left: number; top: number; rotate?: boolean }[] = [
  { left: 31, top: 50 }, // 1 현재
  { left: 31, top: 50, rotate: true }, // 2 장애물 (현재 위에 가로로)
  { left: 31, top: 84 }, // 3 기반
  { left: 10, top: 50 }, // 4 과거
  { left: 31, top: 16 }, // 5 목표
  { left: 52, top: 50 }, // 6 가까운 미래
  { left: 84, top: 87.5 }, // 7 나
  { left: 84, top: 62.5 }, // 8 주변
  { left: 84, top: 37.5 }, // 9 희망과 두려움
  { left: 84, top: 12.5 }, // 10 결과
]

export function CelticLayout({ items, flipped, onFlip }: Props) {
  return (
    <div className="relative mx-auto aspect-[1/1.15] w-full max-w-130">
      {items.map((item, i) => {
        const slot = SLOTS[i]
        return (
          <div
            key={item.position.key}
            className={`absolute w-[16%] -translate-x-1/2 -translate-y-1/2 ${slot.rotate ? 'z-10 rotate-90' : ''}`}
            style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
          >
            <FlipCard
              card={item.card}
              reversed={item.reversed}
              flipped={flipped[i]}
              onFlip={() => onFlip(i)}
              label={`${i + 1}번 ${item.position.label}`}
            />
            <span className="absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-full bg-gold font-mono text-xs text-ink shadow-float">
              {i + 1}
            </span>
          </div>
        )
      })}
    </div>
  )
}
