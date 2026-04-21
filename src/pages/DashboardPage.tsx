import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getAllItems } from '../data/dataService'
import type { DashboardItemView, SolutionType } from '../types'

export default function DashboardPage() {
  const [items, setItems] = useState<DashboardItemView[]>([])
  const [selectedSolution, setSelectedSolution] = useState<SolutionType | null>(null)

  useEffect(() => {
    void (async () => {
      // Load the flattened table rows once; all persistence already lives in the data service.
      setItems(await getAllItems())
    })()
  }, [])

  function toggleSolution(solutionType: SolutionType) {
    // Re-clicking the same solution clears the visual grouping highlight.
    setSelectedSolution((current) => (current === solutionType ? null : solutionType))
  }

  return (
    <section className="page">
      <div className="page-intro">
        <div>
          <p className="section-kicker">Overview</p>
          <h2>Main Dashboard</h2>
        </div>
        <p>
          Surface all tracked items in one place, group them by solution type, and jump directly
          into the history and action workflow for any item.
        </p>
      </div>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__eyebrow">Item Table</p>
            <h3>Cross-solution inventory snapshot</h3>
          </div>
          <span className="panel__caption">{items.length} seeded items</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Solution</th>
                <th>Location</th>
                <th aria-label="Details column" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isHighlighted = item.solutionType === selectedSolution

                return (
                  <tr
                    key={item.id}
                    className={isHighlighted ? 'is-highlighted' : undefined}
                    onClick={() => toggleSolution(item.solutionType)}
                  >
                    <td>{item.name}</td>
                    <td>{item.solutionLabel}</td>
                    <td>{item.locationName}</td>
                    <td className="table-action">
                      <Link to={`/items/${item.id}`} onClick={(event) => event.stopPropagation()}>
                        See Details
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
