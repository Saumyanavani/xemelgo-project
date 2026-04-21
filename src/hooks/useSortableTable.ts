import { useMemo, useState } from 'react'

type SortDirection = 'asc' | 'desc' | null

export function useSortableTable<T extends object>(data: T[]) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortKey] ?? '').toLowerCase()
      const bVal = String((b as Record<string, unknown>)[sortKey] ?? '').toLowerCase()
      const cmp = aVal.localeCompare(bVal)
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDirection])

  return { sortedData, sortKey, sortDirection, handleSort }
}
