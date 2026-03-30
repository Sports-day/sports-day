import { useState, useEffect } from 'react'
import { MOCK_ANNOUNCEMENTS, persistAnnouncements } from '../mock'

// モジュールレベルのリスナーセット
const _listeners = new Set<() => void>()

export function notifyAnnouncementListeners() {
  _listeners.forEach(fn => fn())
}

export function useAnnouncements() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const trigger = () => rerender(n => n + 1)
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  const addAnnouncement = (name: string, content: string) => {
    MOCK_ANNOUNCEMENTS.push({ id: String(Date.now()), name, content })
    persistAnnouncements()
    notifyAnnouncementListeners()
  }

  return { data: MOCK_ANNOUNCEMENTS, loading: false, error: null, addAnnouncement }
}
