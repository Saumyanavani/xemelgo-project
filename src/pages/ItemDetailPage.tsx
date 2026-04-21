import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import SortableHeader from '../components/SortableHeader'
import StatusBadge from '../components/StatusBadge'
import TimestampCell from '../components/TimestampCell'
import { applyAction, getItemDetail, getLocations } from '../data/dataService'
import { useAuth } from '../context/AuthContext'
import { useSortableTable } from '../hooks/useSortableTable'
import type { ItemDetailView, Location } from '../types'

const TERMINAL_STATUS_BY_ACTION = {
  missing: 'missing',
  consume: 'consumed',
  complete: 'complete',
} as const

export default function ItemDetailPage() {
  const { itemId = '' } = useParams()
  const { activeUser } = useAuth()
  const [detail, setDetail] = useState<ItemDetailView | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [selectedHistoryLocation, setSelectedHistoryLocation] = useState<string | null>(null)
  const [selectedHistoryUser, setSelectedHistoryUser] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMissing, setIsMissing] = useState(false)
  const locSort = useSortableTable(detail?.locationHistory ?? [])
  const actSort = useSortableTable(detail?.actionHistory ?? [])

  useEffect(() => {
    void loadPageData()
  }, [itemId])

  async function loadPageData() {
    // Refresh the full detail payload after every mutation so summary and history stay in sync.
    const [loadedDetail, loadedLocations] = await Promise.all([getItemDetail(itemId), getLocations()])

    setDetail(loadedDetail)
    setLocations(loadedLocations)
    setSelectedLocationId('')
    setSelectedHistoryLocation(null)
    setSelectedHistoryUser(null)
    setIsMissing(!loadedDetail)
  }

  if (isMissing) {
    return (
      <section className="page">
        <section className="panel panel--empty">
          <p className="section-kicker">Item not found</p>
          <h2>The requested item is not available.</h2>
          <Link className="inline-link" to="/dashboard">
            Back to dashboard
          </Link>
        </section>
      </section>
    )
  }

  if (!detail || !activeUser) {
    return (
      <section className="page">
        <section className="panel panel--empty">
          <p className="section-kicker">Loading</p>
          <h2>Preparing item history…</h2>
        </section>
      </section>
    )
  }

  const itemDetail = detail
  const currentUser = activeUser
  const terminalActionType = itemDetail.item.terminalActionType as keyof typeof TERMINAL_STATUS_BY_ACTION
  const terminalStatus = TERMINAL_STATUS_BY_ACTION[terminalActionType]
  const isTerminalStateActive = itemDetail.item.status === terminalStatus

  async function handleLocationAction() {
    if (!selectedLocationId) {
      return
    }

    setIsSubmitting(true)
    // Location actions move the item back into an active state and append both histories.
    await applyAction(itemId, currentUser.id, itemDetail.item.locationActionType, selectedLocationId)
    await loadPageData()
    setIsSubmitting(false)
  }

  async function handleTerminalAction() {
    setIsSubmitting(true)
    // Terminal actions clear the current location and append only action history.
    await applyAction(itemId, currentUser.id, itemDetail.item.terminalActionType)
    await loadPageData()
    setIsSubmitting(false)
  }

  return (
    <section className="page">
      <div className="page-intro page-intro--compact">
        <div>
          <p className="section-kicker">Item Detail</p>
          <h2>Solution Details - {itemDetail.item.solutionTitle}</h2>
        </div>
        <Link className="inline-link" to="/dashboard">
          Back to dashboard
        </Link>
      </div>

      <div className="detail-layout">
        <aside className="panel detail-summary">
          <div className="detail-summary__header">
            <p className="detail-summary__label">Item Name:</p>
            <h3>{itemDetail.item.name}</h3>
          </div>

          <button
            type="button"
            className="primary-button primary-button--block"
            onClick={handleTerminalAction}
            disabled={isSubmitting || isTerminalStateActive}
          >
            {itemDetail.item.terminalActionLabel}
          </button>

          <div className="detail-summary__grid">
            <div>
              <span className="detail-summary__label">Solution</span>
              <strong>{itemDetail.item.solutionLabel}</strong>
            </div>
            <div>
              <span className="detail-summary__label">Status</span>
              <StatusBadge status={itemDetail.item.status} />
            </div>
            <div>
              <span className="detail-summary__label">Current Location</span>
              <strong>{itemDetail.item.currentLocationName}</strong>
            </div>
          </div>

          <div className="detail-summary__actions">
            <label className="select-field">
              <span>{itemDetail.item.locationActionLabel}</span>
              <select value={selectedLocationId} onChange={(event) => setSelectedLocationId(event.target.value)}>
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="secondary-button secondary-button--block"
              onClick={handleLocationAction}
              disabled={isSubmitting || !selectedLocationId}
            >
              Apply {itemDetail.item.locationActionLabel}
            </button>
          </div>

          {isTerminalStateActive ? (
            <p className="detail-summary__hint">
              This item is in a terminal state. Use a location-based action to reactivate it.
            </p>
          ) : (
            <p className="detail-summary__hint">
              All new actions are stamped with the active user selected in the header.
            </p>
          )}
        </aside>

        <div className="detail-history">
          <section className="panel">
            <div className="panel__header panel__header--tight">
              <div>
                <h3>Location History</h3>
                <p className="panel__subtext">Last 6 locations</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <SortableHeader label="Location" columnKey="locationName" sortKey={locSort.sortKey} sortDirection={locSort.sortDirection} onSort={locSort.handleSort} />
                    <SortableHeader label="Timestamp" columnKey="timestamp" sortKey={locSort.sortKey} sortDirection={locSort.sortDirection} onSort={locSort.handleSort} />
                  </tr>
                </thead>
                <tbody>
                  {locSort.sortedData.map((event) => {
                    const isHighlighted = selectedHistoryLocation === event.locationId

                    return (
                      <tr
                        key={event.id}
                        className={isHighlighted ? 'is-highlighted' : undefined}
                        // Match all repeated locations so the interviewer can see the grouping behavior quickly.
                        onClick={() =>
                          setSelectedHistoryLocation((current) =>
                            current === event.locationId ? null : event.locationId,
                          )
                        }
                      >
                        <td className="table-linkish">{event.locationName}</td>
                        <td>
                          <TimestampCell value={event.timestamp} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel__header panel__header--tight">
              <div>
                <h3>Action History</h3>
                <p className="panel__subtext">Last 6 actions</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <SortableHeader label="User" columnKey="userName" sortKey={actSort.sortKey} sortDirection={actSort.sortDirection} onSort={actSort.handleSort} />
                    <SortableHeader label="Action" columnKey="actionLabel" sortKey={actSort.sortKey} sortDirection={actSort.sortDirection} onSort={actSort.handleSort} />
                    <SortableHeader label="Timestamp" columnKey="timestamp" sortKey={actSort.sortKey} sortDirection={actSort.sortDirection} onSort={actSort.handleSort} />
                  </tr>
                </thead>
                <tbody>
                  {actSort.sortedData.map((event) => {
                    const isHighlighted = selectedHistoryUser === event.userId

                    return (
                      <tr
                        key={event.id}
                        className={isHighlighted ? 'is-highlighted' : undefined}
                        // Match all repeated users so the action-history grouping mirrors the brief.
                        onClick={() =>
                          setSelectedHistoryUser((current) => (current === event.userId ? null : event.userId))
                        }
                      >
                        <td className="table-linkish">{event.userName}</td>
                        <td>{event.actionLabel}</td>
                        <td>
                          <TimestampCell value={event.timestamp} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
