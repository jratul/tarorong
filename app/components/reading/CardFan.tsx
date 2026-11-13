import type { CSSProperties } from 'react'
import { CardBack } from '~/components/card/CardBack'

interface Props {
  count: number
  picked: number[]
  max: number
  shuffling: boolean
  onPick: (index: number) => void
}

const PICK_LIFT = -34

// 뒷면 카드를 부채꼴로 펼친다. 각도는 CSS 변수(--spread)로 화면 크기별로 정해서 prerender/hydration에 안전하다.
// 셔플 중에는 모든 카드가 가운데로 모였다가(--t: 0) 다시 펼쳐진다.
// 카드는 자기 아래쪽 먼 점(모바일 340px, 웹 520px)을 축으로 돌아서, 양 끝 카드는
// 반경 × (1 − cos(spread/2))만큼 내려간다. 컨테이너 높이 = 위 여백 + 카드 높이 + 그 낙차.
// 카드 수는 모든 스프레드에서 12장: 모바일 폭(약 358px)에서 카드 사이 간격 24px 이상
// (터치 영역 기준)을 지킬 수 있는 최대치다. 13장부터는 Lighthouse target-size에 걸린다.
export function CardFan({ count, picked, max, shuffling, onPick }: Props) {
  return (
    <div className="relative h-52 overflow-hidden [--spread:70deg] lg:h-80 lg:[--spread:84deg]">
      {Array.from({ length: count }, (_, i) => {
        const order = picked.indexOf(i)
        const isPicked = order >= 0
        const t = shuffling ? 0 : i / (count - 1) - 0.5
        const style = {
          '--t': t,
          transform: `rotate(calc(var(--t) * var(--spread))) translateY(${isPicked ? PICK_LIFT : 0}px)`,
        } as CSSProperties
        return (
          <button
            key={i}
            type="button"
            style={style}
            disabled={shuffling || (!isPicked && picked.length >= max)}
            aria-pressed={isPicked}
            aria-label={isPicked ? `${order + 1}번째로 고른 카드, 다시 누르면 취소` : `카드 ${i + 1}`}
            onClick={() => onPick(i)}
            className={`absolute top-10 left-[calc(50%-30px)] w-15 origin-[30px_340px] transition-[transform,opacity,filter] duration-300 hover:brightness-110 disabled:cursor-default motion-reduce:transition-none lg:left-[calc(50%-42px)] lg:w-21 lg:origin-[42px_520px] ${
              isPicked ? 'opacity-35' : ''
            }`}
          >
            <CardBack />
          </button>
        )
      })}
    </div>
  )
}
