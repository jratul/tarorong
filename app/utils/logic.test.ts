import { describe, expect, it } from 'vitest'
import { CARDS } from '~/data/cards'
import { MEANINGS } from '~/data/meanings'
import { SPREADS } from '~/data/spreads'
import type { Reading } from '~/models/reading'
import { kstDateKey, pickDailyCard } from './dailyCard'
import { buildItems, missingMeanings, summarize } from './interpret'
import { hasBatchim, josa } from './josa'
import { secureRandomInt, shuffle } from './random'
import { decodeReading, encodeReading } from './readingQuery'
import { hashString, seededRandom } from './seededRandom'

describe('카드 의미 데이터', () => {
  it('78장 모두 의미가 있고 빈 칸이 없다', () => {
    expect(missingMeanings()).toEqual([])
    expect(Object.keys(MEANINGS)).toHaveLength(78)
    for (const [id, m] of Object.entries(MEANINGS)) {
      expect(m.tip, id).not.toBe('')
      for (const side of [m.upright, m.reversed]) {
        expect(side.keywords.length, id).toBeGreaterThanOrEqual(3)
        for (const text of [side.summary, side.description, side.love, side.work, side.money, side.advice]) {
          expect(text.trim(), id).not.toBe('')
        }
      }
    }
  })
})

describe('random', () => {
  it('secureRandomInt는 범위 안의 정수를 낸다', () => {
    for (let i = 0; i < 200; i++) {
      const n = secureRandomInt(78)
      expect(Number.isInteger(n) && n >= 0 && n < 78).toBe(true)
    }
  })

  it('shuffle은 원본을 바꾸지 않고 같은 원소의 순열을 돌려준다', () => {
    const ids = CARDS.map((c) => c.id)
    const shuffled = shuffle(ids)
    expect(shuffled).toHaveLength(78)
    expect([...shuffled].sort()).toEqual([...ids].sort())
    expect(ids[0]).toBe('major-00-fool')
  })

  it('shuffle은 주입한 난수로 결정적으로 동작한다', () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1])
  })
})

describe('seededRandom / dailyCard', () => {
  it('같은 시드는 같은 수열', () => {
    const a = seededRandom(hashString('seed'))
    const b = seededRandom(hashString('seed'))
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('오늘의 카드는 같은 기기·날짜면 같고, 날짜가 바뀌면 달라질 수 있다', () => {
    const today = pickDailyCard('device-a', '2026-11-13')
    expect(pickDailyCard('device-a', '2026-11-13')).toEqual(today)
    const days = new Set(Array.from({ length: 10 }, (_, d) => pickDailyCard('device-a', `2026-11-${10 + d}`).cardId))
    expect(days.size).toBeGreaterThan(1)
  })

  it('한국 시간 날짜 키', () => {
    // UTC 15:30 = KST 다음 날 00:30
    expect(kstDateKey(new Date('2026-11-13T15:30:00Z'))).toBe('2026-11-14')
  })
})

describe('readingQuery', () => {
  const reading: Reading = {
    spreadId: 'three',
    topic: 'love',
    question: '이번 달 어때?',
    cards: [
      { cardId: 'major-16-tower', reversed: false },
      { cardId: 'major-17-star', reversed: true },
      { cardId: 'cups-03-three', reversed: false },
    ],
  }

  it('인코딩 후 디코딩하면 같다', () => {
    expect(decodeReading(encodeReading(reading))).toEqual(reading)
  })

  it('잘못된 쿼리는 null', () => {
    expect(decodeReading('s=three&t=love&c=major-16-tower')).toBeNull() // 카드 수
    expect(decodeReading('s=nope&t=love&c=major-16-tower')).toBeNull() // 스프레드
    expect(decodeReading('s=one&t=nope&c=major-16-tower')).toBeNull() // 주제
    expect(decodeReading('s=one&t=general&c=fake-card')).toBeNull() // 카드 id
    expect(decodeReading('s=three&t=general&c=major-16-tower,major-16-tower,cups-03-three')).toBeNull() // 중복
  })
})

describe('interpret', () => {
  it('스프레드 자리마다 해석이 생기고 주제 문장을 쓴다', () => {
    const items = buildItems({
      spreadId: 'three',
      topic: 'money',
      cards: [
        { cardId: 'cups-03-three', reversed: false },
        { cardId: 'cups-05-five', reversed: false },
        { cardId: 'pentacles-01-ace', reversed: true },
      ],
    })
    expect(items.map((i) => i.position.label)).toEqual(['과거', '현재', '미래'])
    expect(items[2].text).toBe(MEANINGS['pentacles-01-ace'].reversed.money)
  })

  it('요약은 수트·특별 조합 규칙과 조사를 반영한다', () => {
    const items = buildItems({
      spreadId: 'three',
      topic: 'general',
      cards: [
        { cardId: 'major-16-tower', reversed: false },
        { cardId: 'cups-02-two', reversed: false },
        { cardId: 'cups-07-seven', reversed: false },
      ],
    })
    const { lines } = summarize(items)
    expect(lines.some((l) => l.startsWith('컵이 2장이야. 지금은 감정과 관계가'))).toBe(true)
    expect(lines.some((l) => l.includes('모든 카드가 정방향'))).toBe(true)
    expect(lines.at(-1)).toContain("마지막 '미래' 자리")
  })

  it('모든 스프레드 자리 수만큼 카드를 받으면 해석이 빠짐없이 나온다', () => {
    for (const spread of SPREADS) {
      const cards = CARDS.slice(0, spread.positions.length).map((c) => ({ cardId: c.id, reversed: false }))
      expect(buildItems({ spreadId: spread.id, topic: 'general', cards })).toHaveLength(spread.positions.length)
    }
  })
})

describe('josa', () => {
  it('받침에 따라 조사를 고른다', () => {
    expect(josa('컵', '이', '가')).toBe('컵이')
    expect(josa('완드', '이', '가')).toBe('완드가')
    expect(josa('펜타클', '이', '가')).toBe('펜타클이')
    expect(josa('3', '이', '가')).toBe('3이')
    expect(josa('2', '이', '가')).toBe('2가')
    expect(hasBatchim('현실과 돈')).toBe(true)
  })
})
