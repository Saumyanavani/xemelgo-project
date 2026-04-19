import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import UserSwitcher from './UserSwitcher'

export default function AppShell() {
  const { activeUser, selectUser, users, resetDemo } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!activeUser) {
    return null
  }

  async function handleUserChange(userId: string) {
    await selectUser(userId)
  }

  async function handleReset() {
    const shouldReset = window.confirm('Reset the demo data back to the seeded state?')

    if (!shouldReset) {
      return
    }

    await resetDemo()

    if (location.pathname !== '/dashboard') {
      navigate('/dashboard')
    }
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="brand-lockup">
          <Link to="/dashboard" className="brand-lockup__logo">
            X
          </Link>
          <div>
            <p className="brand-lockup__eyebrow">Dashboard Management</p>
            <h1 className="brand-lockup__title">Xemelgo Operations Portal</h1>
          </div>
        </div>

        <div className="app-shell__controls">
          <button type="button" className="ghost-button" onClick={handleReset}>
            Reset demo data
          </button>
          <UserSwitcher activeUser={activeUser} users={users} onChange={handleUserChange} />
        </div>
      </header>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
