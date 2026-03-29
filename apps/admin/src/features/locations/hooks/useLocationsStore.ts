import { useState, useEffect } from 'react'
import { MOCK_LOCATIONS } from '../mock'
import type { Location } from '../types'

// モジュールレベルで状態を保持し、複数のフックインスタンス間で共有する
let _locations: Location[] = [...MOCK_LOCATIONS]
const _listeners = new Set<() => void>()

function notify() {
  _listeners.forEach(fn => fn())
}

export function useLocationsStore() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const trigger = () => rerender(n => n + 1)
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  return {
    locations: _locations,
    addLocation(location: Location) {
      _locations = [..._locations, location]
      notify()
    },
    updateLocation(id: string, updates: Partial<Location>) {
      _locations = _locations.map(l => l.id === id ? { ...l, ...updates } : l)
      notify()
    },
    deleteLocation(id: string) {
      _locations = _locations.filter(l => l.id !== id)
      notify()
    },
  }
}
