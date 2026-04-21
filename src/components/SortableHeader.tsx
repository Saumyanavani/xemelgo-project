interface SortableHeaderProps {
  label: string
  columnKey: string
  sortKey: string | null
  sortDirection: 'asc' | 'desc' | null
  onSort: (key: string) => void
}

export default function SortableHeader({ label, columnKey, sortKey, sortDirection, onSort }: SortableHeaderProps) {
  const isActive = sortKey === columnKey
  let indicator = '⇅'
  if (isActive && sortDirection === 'asc') indicator = '▲'
  if (isActive && sortDirection === 'desc') indicator = '▼'

  return (
    <th>
      <button
        type="button"
        className={`sort-header-btn${isActive ? ' is-active' : ''}`}
        onClick={() => onSort(columnKey)}
      >
        {label}
        <span className="sort-indicator" aria-hidden="true">
          {indicator}
        </span>
      </button>
    </th>
  )
}
