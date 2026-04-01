import { useState, useEffect } from 'react'
import { MOCK_USERS } from '../mock'

const _listeners = new Set<() => void>()

export function notifyUserListeners() {
  _listeners.forEach(fn => fn())
}

export function useUsers() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const trigger = () => rerender(n => n + 1)
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  return { data: MOCK_USERS, loading: false, error: null }
}
