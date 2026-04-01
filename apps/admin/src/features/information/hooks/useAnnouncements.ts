import { useState, useEffect } from 'react'
import { MOCK_ANNOUNCEMENTS, persistAnnouncements } from '../mock'
import type { Announcement } from '../types'

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

  const addAnnouncement = (name: string, content: string, status: Announcement['status'], scheduledAt?: string) => {
    const now = new Date().toISOString()
    MOCK_ANNOUNCEMENTS.push({ id: String(Date.now()), name, content, createdAt: now, updatedAt: now, status, scheduledAt })
    persistAnnouncements()
    notifyAnnouncementListeners()
  }

  return { data: MOCK_ANNOUNCEMENTS, loading: false, error: null, addAnnouncement }
}
