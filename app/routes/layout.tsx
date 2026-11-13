import { Outlet } from 'react-router'
import { AppNav } from '~/components/layout/AppNav'

export default function SiteLayout() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-300 px-4 pt-6 pb-16">
        <Outlet />
      </main>
    </>
  )
}
