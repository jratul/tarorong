const SIZE = { sm: 'w-11', md: 'w-24', lg: 'w-31' } as const

interface Props {
  size?: keyof typeof SIZE
  sleepy?: boolean
  className?: string
}

// 마스코트 롱이 (시안의 CSS 도형 버전 — 나중에 일러스트로 교체 예정). 모든 치수가 자기 너비 기준이다.
export function Longi({ size = 'md', sleepy = false, className = '' }: Props) {
  const eye = sleepy ? 'top-[50%] h-[3%]' : 'top-[46%] h-[11%]'
  return (
    <span
      aria-hidden="true"
      className={`@container relative block aspect-[1/0.94] shrink-0 ${SIZE[size]} ${className}`}
    >
      <span className="absolute inset-x-[7%] top-[9%] bottom-0 rounded-[50%_50%_46%_46%] bg-gold shadow-glow-gold" />
      <span className={`absolute left-[33%] w-[7.5%] rounded-full bg-ink ${eye}`} />
      <span className={`absolute left-[58%] w-[7.5%] rounded-full bg-ink ${eye}`} />
      <span className="absolute top-[62%] left-[22%] h-[7.5%] w-[14%] rounded-full bg-rose" />
      <span className="absolute top-[62%] left-[63%] h-[7.5%] w-[14%] rounded-full bg-rose" />
      <span className="absolute top-[-6%] left-[63%] font-display text-[21cqw] leading-none text-sky">✦</span>
    </span>
  )
}
