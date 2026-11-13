import type { TarotCard } from '~/models/card'
import { CardBack } from './CardBack'
import { TarotCardFace } from './TarotCardFace'

interface Props {
  card: TarotCard
  reversed: boolean
  flipped: boolean
  onFlip?: () => void
  label: string
  className?: string
}

// 탭하면 뒷면 → 앞면으로 뒤집히는 카드. 모션 줄이기 설정이면 애니메이션 없이 바뀐다.
export function FlipCard({ card, reversed, flipped, onFlip, label, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onFlip}
      disabled={flipped}
      aria-label={flipped ? `${label}: ${card.nameKo}${reversed ? ' 역방향' : ''}` : `${label} 카드 뒤집기`}
      className={`block perspective-[900px] disabled:cursor-default ${className}`}
    >
      <span
        className={`relative block transition-transform duration-700 transform-3d motion-reduce:transition-none ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        <span className="block backface-hidden">
          <CardBack />
        </span>
        <span className="absolute inset-0 block rotate-y-180 backface-hidden">
          <TarotCardFace card={card} reversed={reversed} />
        </span>
      </span>
    </button>
  )
}
