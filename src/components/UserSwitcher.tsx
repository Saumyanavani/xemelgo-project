import type { ChangeEvent } from 'react'

import type { User } from '../types'

interface UserSwitcherProps {
  activeUser: User
  users: User[]
  onChange: (userId: string) => void
}

export default function UserSwitcher({ activeUser, users, onChange }: UserSwitcherProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value)
  }

  return (
    <label className="user-switcher" aria-label="Select active user">
      <span className="user-switcher__meta">
        <span className="user-switcher__name">{activeUser.name}</span>
        <span className="user-switcher__role">{activeUser.role}</span>
      </span>
      <span className="user-switcher__chevron" aria-hidden="true">
        ▾
      </span>
      <select value={activeUser.id} onChange={handleChange}>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  )
}
