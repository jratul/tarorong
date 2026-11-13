interface Props {
  className?: string
}

// 카드 뒷면 (180° 회전 대칭이라 방향이 드러나지 않는다)
export function CardBack({ className = '' }: Props) {
  return (
    <img
      src="/cards/back.svg"
      alt=""
      width={300}
      height={500}
      draggable={false}
      className={`block aspect-3/5 w-full rounded-[7%] shadow-float select-none ${className}`}
    />
  )
}
