/** 메뉴 항목이 지금 경로에서 강조돼야 하는지. 홈('/')은 정확히 일치할 때만. */
export function isNavActive(path: string, to: string): boolean {
  if (to === '/') return path === '/'
  return path === to || path.startsWith(`${to}/`)
}

/**
 * 두 경로가 같은 종류의 화면인지(같은 라우트 안의 이동인지).
 * 첫 세그먼트와 세그먼트 수가 같으면 같은 라우트로 본다.
 *   /draw/one → /draw/celtic, /cards/a → /cards/b : 같은 화면 (본문을 비우지 않는다)
 *   /cards → /cards/a, / → /draw                  : 다른 화면 (전환 중 스피너)
 */
export function isSameRoute(a: string, b: string): boolean {
  const sa = a.split('/').filter(Boolean)
  const sb = b.split('/').filter(Boolean)
  return sa.length === sb.length && sa[0] === sb[0]
}
