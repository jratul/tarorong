import { useLocation, useNavigation } from 'react-router'
import { isSameRoute } from '~/utils/routeTransition'
import { useDelayedFlag } from './useDelayedFlag'

/**
 * 페이지 전환 중 상태.
 *
 * 라우트 모듈은 화면별 청크로 나뉘어 있어, 처음 가는 화면은 청크를 받는 동안 React Router가
 * **주소를 바꾸지 않고 기다린다.** 그 사이 메뉴 강조도 본문도 옛 화면 그대로라, 누른 사람 눈엔
 * 아무 반응이 없다가 한꺼번에 바뀌는 것처럼 보인다.
 *
 * - `activePath`: 이동 중이면 목적지, 아니면 현재 경로 → 메뉴 강조를 **누르는 즉시** 옮긴다
 * - `showSpinner`: 다른 종류의 화면으로 150ms 넘게 걸리는 이동이면 true → 본문을 스피너로 바꾼다
 */
export function useRouteTransition() {
  const { pathname } = useLocation()
  const navigation = useNavigation()

  const pendingPath = navigation.state === 'loading' ? navigation.location.pathname : null
  const activePath = pendingPath ?? pathname
  // 같은 화면 안의 이동(스프레드 칩, 라이트박스 다음 카드 등)은 본문을 비우지 않는다
  const isPageChange = pendingPath !== null && !isSameRoute(pendingPath, pathname)
  const showSpinner = useDelayedFlag(isPageChange ? (navigation.location?.key ?? pendingPath) : null)

  return { activePath, showSpinner }
}
