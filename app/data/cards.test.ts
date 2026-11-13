import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CARDS, getAdjacentCards, getCard } from './cards'

describe('CARDS', () => {
  it('78장이고 id가 겹치지 않는다', () => {
    expect(CARDS).toHaveLength(78)
    expect(new Set(CARDS.map((card) => card.id)).size).toBe(78)
  })

  it('메이저 22장, 수트별 14장', () => {
    expect(CARDS.filter((card) => card.arcana === 'major')).toHaveLength(22)
    for (const suit of ['wands', 'cups', 'swords', 'pentacles'] as const) {
      expect(CARDS.filter((card) => card.suit === suit)).toHaveLength(14)
    }
  })

  it('모든 카드의 일러스트 파일이 존재한다', () => {
    for (const card of CARDS) {
      expect(existsSync(join('public', card.image)), card.image).toBe(true)
    }
  })

  it('id로 카드와 이전/다음 카드를 찾는다', () => {
    expect(getCard('major-17-star')?.nameKo).toBe('별')
    expect(getCard('cups-01-ace')?.nameKo).toBe('컵 에이스')
    expect(getCard('nope')).toBeUndefined()
    const { prev, next } = getAdjacentCards('major-17-star')
    expect(prev?.nameKo).toBe('탑')
    expect(next?.nameKo).toBe('달')
  })
})
