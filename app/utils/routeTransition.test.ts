import { describe, expect, it } from 'vitest'
import { isNavActive, isSameRoute } from './routeTransition'

describe('routeTransition', () => {
  it('메뉴 강조: 홈은 정확히 일치할 때만, 나머지는 하위 경로까지', () => {
    expect(isNavActive('/', '/')).toBe(true)
    expect(isNavActive('/cards', '/')).toBe(false)
    expect(isNavActive('/cards/major-17-star', '/cards')).toBe(true)
    expect(isNavActive('/draw/celtic', '/draw')).toBe(true)
    expect(isNavActive('/drawing', '/draw')).toBe(false)
  })

  it('같은 라우트 안의 이동은 본문을 비우지 않는다', () => {
    expect(isSameRoute('/draw/one', '/draw/celtic')).toBe(true)
    expect(isSameRoute('/cards/major-16-tower', '/cards/major-17-star')).toBe(true)
    expect(isSameRoute('/cards', '/cards/major-17-star')).toBe(false)
    expect(isSameRoute('/', '/draw')).toBe(false)
    expect(isSameRoute('/draw', '/draw/three')).toBe(false)
  })
})
