import { useState } from 'react'
import { MOCK_ANNOUNCEMENTS, persistAnnouncements } from '../mock'
import { notifyAnnouncementListeners } from './useAnnouncements'
import type { Announcement } from '../types'

export function useAnnouncementDetail(id: string) {
  const item = MOCK_ANNOUNCEMENTS.find(a => a.id === id)
  const [name, setName] = useState(item?.name ?? '')
  const [content, setContent] = useState(item?.content ?? '')
  const [status, setStatus] = useState<Announcement['status']>(item?.status ?? 'draft')
  const [scheduledAt, setScheduledAt] = useState(item?.scheduledAt ?? '')

  const handleSave = () => {
    const target = MOCK_ANNOUNCEMENTS.find(a => a.id === id)
    if (target) {
      target.name = name
      target.content = content
      target.status = status
      target.scheduledAt = scheduledAt || undefined
      target.updatedAt = new Date().toISOString()
    }
    persistAnnouncements()
    notifyAnnouncementListeners()
  }

  const handleDelete = () => {
    const index = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === id)
    if (index !== -1) MOCK_ANNOUNCEMENTS.splice(index, 1)
    persistAnnouncements()
    notifyAnnouncementListeners()
  }

  return {
    announcementName: item?.name ?? '',
    name,
    setName,
    content,
    setContent,
    status,
    setStatus,
    scheduledAt,
    setScheduledAt,
    createdAt: item?.createdAt ?? '',
    updatedAt: item?.updatedAt ?? '',
    handleSave,
    handleDelete,
    loading: false,
    error: null,
  }
}
