const TONES = ['bg-gold', 'bg-sky', 'bg-pink', 'bg-lilac'] as const

interface Props {
  children: string
  /** 순서대로 젤리 색을 돌려 쓰고, 그 뒤로는 테두리만 있는 태그 */
  index?: number
}

export function Keyword({ children, index = 0 }: Props) {
  const tone = TONES[index]
  return (
    <span
      className={`rounded-full px-3 py-1.25 font-display text-sm ${
        tone ? `${tone} text-ink` : 'text-cream shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.2)]'
      }`}
    >
      {children}
    </span>
  )
}

export function KeywordList({ items, max = 6 }: { items: string[]; max?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, max).map((item, i) => (
        <Keyword key={item} index={i}>
          {item}
        </Keyword>
      ))}
    </div>
  )
}
