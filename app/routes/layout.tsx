import { Outlet } from 'react-router'
import { AppNav } from '~/components/layout/AppNav'
import { RouteSpinner } from '~/components/layout/RouteSpinner'
import { useRouteTransition } from '~/hooks/useRouteTransition'

export default function SiteLayout() {
  const { activePath, showSpinner } = useRouteTransition()
  return (
    <>
      <AppNav activePath={activePath} />
      <main className="mx-auto max-w-300 px-4 pt-6 pb-16">{showSpinner ? <RouteSpinner /> : <Outlet />}</main>
    </>
  )
}
