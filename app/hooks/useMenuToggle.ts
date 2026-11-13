import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router'

// 모바일 햄버거 메뉴 열림 상태. 페이지가 바뀌거나 Esc를 누르면 닫힌다.
export function useMenuToggle() {
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState<string | null>(null)
  const { pathname } = useLocation()

  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (open) setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])

  return { open, toggle, close }
}
