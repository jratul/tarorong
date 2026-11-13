import type { TarotCard } from '~/models/card'

interface Props {
  card: TarotCard
  reversed?: boolean
  /** 첫 화면에 보이는 큰 카드면 true — lazy 로딩을 끈다 */
  priority?: boolean
  className?: string
}

// 시안의 .tcard--face: 위 숫자 · 일러스트 · 아래 이름. 전체 비율은 뒷면과 같은 3:5.
// 안쪽 여백·글자 크기는 카드 자신의 너비(cqw) 기준이라 작은 썸네일에서도 비율이 유지된다.
export function TarotCardFace({ card, reversed = false, priority = false, className = '' }: Props) {
  return (
    <div className={`@container ${className}`}>
      <div className="flex aspect-3/5 flex-col gap-[3cqw] rounded-[7cqw] bg-cream p-[7cqw] text-ink shadow-glow-pink">
        <span className="text-center font-mono text-[max(12px,5.5cqw)] leading-none font-medium tracking-wide">
          {card.numeral}
        </span>
        <div className="min-h-0 flex-1 overflow-hidden rounded-[5cqw]">
          <img
            src={card.image}
            alt={card.nameKo}
            width={256}
            height={372}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className={`block size-full object-cover ${reversed ? 'rotate-180' : ''}`}
          />
        </div>
        <span className="truncate text-center font-display text-[max(12px,8.5cqw)] leading-tight">{card.nameKo}</span>
      </div>
    </div>
  )
}
