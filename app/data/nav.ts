export interface NavItem {
  to: string
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈' },
  { to: '/cards', label: '도감' },
  { to: '/draw', label: '뽑기' },
  { to: '/guide', label: '타로 기초' },
]
