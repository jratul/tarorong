import { pageMeta } from '~/utils/meta'

export const meta = () => pageMeta('카드 뽑기')

export default function Draw() {
  return (
    <section className="flex flex-col items-center gap-4 pt-10 text-center">
      <h1 className="font-display text-3xl text-gold">카드 뽑기</h1>
      <p className="text-cream/70">스프레드를 고르고 카드를 뽑는 화면이 들어올 자리야.</p>
      <img src="/cards/back.svg" alt="" width={300} height={500} className="w-40 drop-shadow-xl" />
    </section>
  )
}
