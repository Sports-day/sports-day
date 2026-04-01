import { useState, useEffect } from 'react'
import { MOCK_TEAMS } from '../mock'

const _listeners = new Set<() => void>()

export function notifyTeamListeners() {
  _listeners.forEach(fn => fn())
}

export function useTeams() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const trigger = () => rerender(n => n + 1)
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  return { data: MOCK_TEAMS, loading: false, error: null }
}
