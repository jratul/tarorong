/** 0 이상 max 미만의 고른 정수. crypto 난수 + 거부 샘플링으로 모듈로 편향을 없앤다. */
export function secureRandomInt(max: number): number {
  if (max <= 0) throw new Error('max는 1 이상이어야 해')
  const limit = Math.floor(0x1_0000_0000 / max) * max
  const buf = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    if (buf[0] < limit) return buf[0] % max
  }
}

/** Fisher–Yates 셔플. `random(n)`은 0 이상 n 미만의 정수를 돌려줘야 한다. */
export function shuffle<T>(items: readonly T[], random: (n: number) => number = secureRandomInt): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function secureCoin(): boolean {
  return secureRandomInt(2) === 1
}
