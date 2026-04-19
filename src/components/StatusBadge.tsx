import type { ItemStatus } from '../types'

const LABELS: Record<ItemStatus, string> = {
  active: 'Active',
  missing: 'Missing',
  consumed: 'Consumed',
  complete: 'Complete',
}

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return <span className={`status-badge status-badge--${status}`}>{LABELS[status]}</span>
}
