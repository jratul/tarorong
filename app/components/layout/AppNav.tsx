import { Link, NavLink } from 'react-router'
import { NAV_ITEMS } from '~/data/nav'
import { useMenuToggle } from '~/hooks/useMenuToggle'

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 font-display text-base transition-colors ${
    isActive ? 'bg-gold text-ink' : 'text-cream/80 hover:text-gold'
  }`

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `block rounded-2xl px-4 py-3 font-display text-lg ${isActive ? 'bg-gold text-ink' : 'text-cream hover:bg-white/10'}`

export function AppNav() {
  const { open, toggle, close } = useMenuToggle()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl text-gold">
          타로롱 <span className="text-sky">☾</span>
        </Link>

        <nav aria-label="주 메뉴" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={desktopLink}>
              {item.label}
            </NavLink>
          ))}
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
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileLink} onClick={close}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
