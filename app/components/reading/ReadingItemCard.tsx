import { Link } from 'react-router'
import { FlipCard } from '~/components/card/FlipCard'
import type { ReadingItem } from '~/models/reading'

interface Props {
  item: ReadingItem
  index: number
  flipped: boolean
  onFlip: () => void
  /** 켈틱 크로스처럼 카드는 배치도에 따로 그릴 때 false */
  showCard?: boolean
}

export function OrientationBadge({ reversed }: { reversed: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 font-sans text-xs ${reversed ? 'bg-rose text-ink' : 'bg-sky text-ink'}`}>
      {reversed ? '역방향' : '정방향'}
    </span>
  )
}

export function ReadingItemCard({ item, index, flipped, onFlip, showCard = true }: Props) {
  return (
    <article
      className={`flex gap-4 rounded-[28px] bg-surface p-4 ${showCard ? 'lg:flex-col lg:items-center lg:text-center' : ''}`}
    >
      {showCard ? (
        <FlipCard
          card={item.card}
          reversed={item.reversed}
          flipped={flipped}
          onFlip={onFlip}
          label={item.position.label}
          className="w-21.5 shrink-0 lg:w-32"
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold font-mono text-sm text-ink">
          {index + 1}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="font-display text-[13px] text-gold">{item.position.label}</span>
        {flipped ? (
          <>
            <h3
              className={`flex flex-wrap items-center gap-2 font-display text-[19px] ${showCard ? 'lg:justify-center' : ''}`}
            >
              {item.card.nameKo} <OrientationBadge reversed={item.reversed} />
            </h3>
            <p className="text-sm leading-relaxed text-pretty text-cream/85">{item.text}</p>
            <Link to={`/cards/${item.card.id}`} className="text-xs text-pink hover:text-gold">
              카드 의미 자세히 ›
            </Link>
          </>
        ) : (
          <p className="text-sm text-cream/60">
            {item.position.description}
            <br />
            {showCard ? '카드를 눌러 뒤집어봐.' : '배치도의 카드를 눌러 뒤집어봐.'}
          </p>
        )}
      </div>
    </article>
  )
}
