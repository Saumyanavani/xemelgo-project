import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { getActiveUserId, getUsers, resetDemoData, seedIfEmpty, setActiveUserId } from '../data/dataService'
import type { User } from '../types'

interface AuthContextValue {
  ready: boolean
  users: User[]
  activeUser: User | null
  selectUser: (id: string) => Promise<void>
  resetDemo: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [activeUserId, setActiveUserIdState] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      // Seed once on startup, then restore any previously selected acting user.
      await seedIfEmpty()
      const loadedUsers = await getUsers()
      const storedActiveUserId = getActiveUserId()

      setUsers(loadedUsers)
      setActiveUserIdState(
        loadedUsers.some((user) => user.id === storedActiveUserId) ? storedActiveUserId : null,
      )
      setReady(true)
    })()
  }, [])

  async function selectUser(id: string) {
    // Keep acting user global because every new action-history entry depends on it.
    setActiveUserId(id)
    setActiveUserIdState(id)

    if (!users.length) {
      setUsers(await getUsers())
    }
  }

  async function resetDemo() {
    // Preserve the acting user through resets so demo flows stay smooth during presentation.
    const preservedUserId = getActiveUserId()
    await resetDemoData()
    const loadedUsers = await getUsers()

    setUsers(loadedUsers)
    setActiveUserIdState(loadedUsers.some((user) => user.id === preservedUserId) ? preservedUserId : null)
  }

  const activeUser = users.find((user) => user.id === activeUserId) ?? null

  return (
    <AuthContext.Provider value={{ ready, users, activeUser, selectUser, resetDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
