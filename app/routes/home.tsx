import { Link } from 'react-router'
import { pageMeta } from '~/utils/meta'

export const meta = () => pageMeta()

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-6 pt-10 text-center">
      <h1 className="font-display text-[clamp(32px,4.4vw,52px)] leading-tight text-cream">
        안녕, 별빛 친구!
        <br />
        <em className="text-gold not-italic">오늘은 뭐가 궁금해?</em>
      </h1>
      <p className="text-cream/70">오늘의 카드와 스프레드는 곧 여기에 들어와.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/draw" className="rounded-full bg-gold px-6 py-3 font-display text-ink shadow-glow-gold">
          카드 뽑기
        </Link>
        <Link to="/cards" className="rounded-full border border-white/25 px-6 py-3 font-display text-cream">
          도감 보기
        </Link>
      </div>
    </section>
  )
}
