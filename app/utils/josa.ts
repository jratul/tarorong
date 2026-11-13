// 숫자를 한국어로 읽었을 때 받침 유무 (0 영, 1 일, 2 이, 3 삼, 4 사, 5 오, 6 육, 7 칠, 8 팔, 9 구)
const DIGIT_BATCHIM = [true, true, false, true, false, false, true, true, true, false]

/** 단어의 마지막 글자에 받침이 있는지 */
export function hasBatchim(word: string): boolean {
  const last = word.trim().at(-1)
  if (!last) return false
  if (/[0-9]/.test(last)) return DIGIT_BATCHIM[Number(last)]
  const code = last.charCodeAt(0) - 0xac00
  if (code < 0 || code > 11171) return false
  return code % 28 !== 0
}

/** 받침에 맞는 조사를 붙인다: josa('컵', '이', '가') → '컵이' */
export function josa(word: string, withBatchim: string, withoutBatchim: string): string {
  return word + (hasBatchim(word) ? withBatchim : withoutBatchim)
}
