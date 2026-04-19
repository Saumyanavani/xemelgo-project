import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { activeUser, users, selectUser } = useAuth()
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState('')

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0].id)
    }
  }, [selectedUserId, users])

  if (activeUser) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleContinue() {
    if (!selectedUserId) {
      return
    }

    await selectUser(selectedUserId)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-hero__copy">
          <p className="section-kicker">Xemelgo Interview Project</p>
          <h1>Track every asset, inventory item, and work order from one place.</h1>
          <p>
            This localhost demo keeps the project self-contained while still using a real local
            database. Pick the acting user to enter the dashboard and start tracing item history.
          </p>
        </div>

        <div className="login-card">
          <div>
            <p className="section-kicker">Mocked Sign In</p>
            <h2>Choose your active user</h2>
            <p className="login-card__hint">
              The selected person will be recorded for every new action-history entry.
            </p>
          </div>

          <div className="login-card__users">
            {users.map((user) => {
              const isSelected = user.id === selectedUserId

              return (
                <button
                  key={user.id}
                  type="button"
                  className={`user-tile${isSelected ? ' user-tile--selected' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <span className="user-tile__name">{user.name}</span>
                  <span className="user-tile__role">{user.role}</span>
                </button>
              )
            })}
          </div>

          <button type="button" className="primary-button" onClick={handleContinue} disabled={!selectedUserId}>
            Enter dashboard
          </button>
        </div>
      </section>
    </div>
  )
}
