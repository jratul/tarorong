import { CardBack } from '~/components/card/CardBack'
import type { Spread } from '~/models/reading'

interface Props {
  spread: Spread
  pickedCount: number
}

// 스프레드 자리. 고른 순서대로 뒷면 카드가 들어간다.
export function SpreadSlots({ spread, pickedCount }: Props) {
  const cols = Math.min(spread.positions.length, 5)
  return (
    <ol
      className="mx-auto grid w-full max-w-115 gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {spread.positions.map((position, i) => (
        <li key={position.key} className="flex flex-col items-center gap-1.5">
          <div className="w-full max-w-18">
            {i < pickedCount ? (
              <CardBack />
            ) : (
              <div className="flex aspect-3/5 items-center justify-center rounded-[7%] border-2 border-dashed border-gold/45 font-display text-xl text-gold/75">
                ✦
              </div>
            )}
          </div>
          <span className="text-center font-display text-[13px] leading-tight text-gold">{position.label}</span>
        </li>
      ))}
    </ol>
  )
}
