import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import AppShell from './components/AppShell'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import ItemDetailPage from './pages/ItemDetailPage'
import LoginPage from './pages/LoginPage'

function ProtectedRoute() {
  const { activeUser } = useAuth()

  if (!activeUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function HomeRedirect() {
  const { activeUser } = useAuth()

  return <Navigate to={activeUser ? '/dashboard' : '/login'} replace />
}

function AppRoutes() {
  const { ready } = useAuth()

  if (!ready) {
    return (
      <div className="app-loader">
        <div className="app-loader__card">
          <p className="section-kicker">Initializing</p>
          <h1>Preparing the Xemelgo demo workspace…</h1>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/items/:itemId" element={<ItemDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
