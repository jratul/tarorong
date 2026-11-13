import { useMemo, useState } from 'react'
import { type CardFilter, searchCards } from '~/utils/searchCards'

export function useCardFilter() {
  const [filter, setFilter] = useState<CardFilter>('all')
  const [query, setQuery] = useState('')
  const cards = useMemo(() => searchCards(filter, query), [filter, query])
  return { filter, setFilter, query, setQuery, cards }
}
