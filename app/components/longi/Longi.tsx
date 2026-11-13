import { useId } from 'react'

const SIZE = { sm: 'w-11', md: 'w-24', lg: 'w-31' } as const
const INK = '#1e1a3a'

export type LongiMood = 'smile' | 'happy' | 'sleepy' | 'wink' | 'surprised'

interface Props {
  size?: keyof typeof SIZE
  mood?: LongiMood
  className?: string
}

// 표정별 눈·입. 좌표는 viewBox(0 0 120 112) 기준, 왼눈 x=46 · 오른눈 x=74 · 눈높이 y=62
function Face({ mood }: { mood: LongiMood }) {
  const stroke = { stroke: INK, strokeWidth: 3.2, strokeLinecap: 'round' as const, fill: 'none' }
  const dot = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={62} rx={4.4} ry={5.6} fill={INK} />
      <circle cx={cx + 1.6} cy={59.6} r={1.6} fill="#fff" />
    </g>
  )
  switch (mood) {
    case 'happy':
      return (
        <>
          <path d="M39,64 q7,-9 14,0 M67,64 q7,-9 14,0" {...stroke} />
          <path d="M51,72 q9,11 18,0Z" fill={INK} />
          <path d="M55,76 q5,3 10,0" stroke="#ff8fbf" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </>
      )
    case 'sleepy':
      return (
        <>
          <path d="M39,62 q7,5 14,0 M67,62 q7,5 14,0" {...stroke} />
          <path d="M56,74 h8" {...stroke} />
          <text x={14} y={40} fontFamily="Jua, sans-serif" fontSize={14} fill="#b9e6ff">
            z
          </text>
          <text x={6} y={30} fontFamily="Jua, sans-serif" fontSize={10} fill="#b9e6ff">
            z
          </text>
        </>
      )
    case 'wink':
      return (
        <>
          {dot(46)}
          <path d="M67,63 q7,-7 14,0" {...stroke} />
          <path d="M53,72 q7,7 14,0" {...stroke} />
        </>
      )
    case 'surprised':
      return (
        <>
          {dot(46)}
          {dot(74)}
          <ellipse cx={60} cy={76} rx={4.6} ry={5.6} fill={INK} />
        </>
      )
    default:
      return (
        <>
          {dot(46)}
          {dot(74)}
          <path d="M54,72 q6,6 12,0" {...stroke} />
        </>
      )
  }
}

// 마스코트 롱이: 별빛을 머금은 노란 젤리. 장식용이라 스크린리더에서는 숨긴다.
export function Longi({ size = 'md', mood = 'smile', className = '' }: Props) {
  const id = useId()
  const body = `${id}-body`
  const glow = `${id}-glow`
  return (
    <svg
      viewBox="0 0 120 112"
      aria-hidden="true"
      className={`block shrink-0 overflow-visible ${SIZE[size]} ${className}`}
    >
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#ffe9a6" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffe9a6" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="1" stopColor="#ffdf86" />
        </linearGradient>
      </defs>
      <ellipse cx={60} cy={66} rx={62} ry={54} fill={`url(#${glow})`} />
      {/* 발 */}
      <ellipse cx={40} cy={104} rx={13} ry={6} fill="#f5cf6b" />
      <ellipse cx={80} cy={104} rx={13} ry={6} fill="#f5cf6b" />
      {/* 몸 */}
      <path
        d="M14,102 C8,60 30,18 60,18 C90,18 112,60 106,102 Q60,113 14,102Z"
        fill={`url(#${body})`}
        stroke="#f2c75c"
        strokeWidth={2}
      />
      {/* 젤리 광택 */}
      <ellipse cx={38} cy={38} rx={11} ry={7} fill="#fff" opacity={0.7} transform="rotate(-30 38 38)" />
      <circle cx={52} cy={30} r={2.6} fill="#fff" opacity={0.75} />
      {/* 볼 */}
      <ellipse cx={33} cy={74} rx={8} ry={4.6} fill="#ffb1d6" opacity={0.85} />
      <ellipse cx={87} cy={74} rx={8} ry={4.6} fill="#ffb1d6" opacity={0.85} />
      <Face mood={mood} />
      {/* 머리 위 별 */}
      <path d="M88,4 Q90,12 98,14 Q90,16 88,24 Q86,16 78,14 Q86,12 88,4Z" fill="#b9e6ff" />
    </svg>
  )
}
