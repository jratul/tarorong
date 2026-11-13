import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1e1a3a" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {/* 새 페이지로 이동하면 맨 위에서 시작하고, 뒤로 가기는 이전 스크롤 위치를 복원한다 */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = '앗, 문제가 생겼어'
  let details = '잠시 후에 다시 시도해줘.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '길을 잃었어' : '앗, 문제가 생겼어'
    details = error.status === 404 ? '찾는 페이지가 없어. 홈으로 돌아가볼까?' : error.statusText || details
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 pt-24 text-center">
      <h1 className="font-display text-3xl text-gold">{message}</h1>
      <p className="text-cream/70">{details}</p>
      <a href="/" className="rounded-full bg-gold px-5 py-2.5 font-display text-ink">
        홈으로
      </a>
      {stack && (
        <pre className="w-full overflow-x-auto rounded-2xl bg-surface p-4 text-left text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
