const SITE = '타로롱'
const DEFAULT_DESCRIPTION = '귀여운 젤리 친구 롱이와 함께 타로카드 78장을 알아보고, 오늘의 카드를 뽑아보는 타로 앱'

export function pageMeta(title?: string, description = DEFAULT_DESCRIPTION) {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} · 별이 들려주는 타로 이야기`
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ]
}
