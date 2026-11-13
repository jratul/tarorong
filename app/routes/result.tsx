import { pageMeta } from '~/utils/meta'

export const meta = () => pageMeta('리딩 결과')

export default function Result() {
  return (
    <section className="flex flex-col items-center gap-4 pt-10 text-center">
      <h1 className="font-display text-3xl text-gold">리딩 결과</h1>
      <p className="text-cream/70">뽑은 카드의 해석이 들어올 자리야.</p>
    </section>
  )
}
