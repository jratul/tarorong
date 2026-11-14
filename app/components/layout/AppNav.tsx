import { Link } from 'react-router'
import { NAV_ITEMS } from '~/data/nav'
import { useMenuToggle } from '~/hooks/useMenuToggle'
import { isNavActive } from '~/utils/routeTransition'

const desktopLink = (isActive: boolean) =>
  `rounded-full px-4 py-2 font-display text-base transition-colors ${
    isActive ? 'bg-gold text-ink' : 'text-cream/80 hover:text-gold'
  }`

const mobileLink = (isActive: boolean) =>
  `block rounded-2xl px-4 py-3 font-display text-lg ${isActive ? 'bg-gold text-ink' : 'text-cream hover:bg-white/10'}`

interface Props {
  /** 강조할 경로. 페이지 전환 중이면 목적지라서, 누르는 즉시 강조가 옮겨간다 */
  activePath: string
}

// NavLink의 isActive는 이동이 끝나야 바뀌므로 쓰지 않고, 레이아웃이 넘겨준 activePath로 판단한다
export function AppNav({ activePath }: Props) {
  const { open, toggle, close } = useMenuToggle()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl text-gold">
          타로롱 <span className="text-sky">☾</span>
        </Link>

        <nav aria-label="주 메뉴" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(activePath, item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={desktopLink(active)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-2xl text-cream hover:bg-white/10 lg:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={toggle}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="주 메뉴" className="border-t border-white/10 px-4 pt-2 pb-4 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(activePath, item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={mobileLink(active)}
                onClick={close}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
