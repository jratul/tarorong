// 페이지 전환 중 본문 자리에 띄우는 로딩 표시.
// 화면 높이를 어느 정도 차지해야 헤더만 남고 본문이 사라진 것처럼 보이지 않는다.
export function RouteSpinner() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-4 border-white/12 border-t-gold motion-reduce:animate-none"
      />
      <span className="font-display text-sm text-gold">별을 불러오는 중…</span>
    </div>
  )
}
