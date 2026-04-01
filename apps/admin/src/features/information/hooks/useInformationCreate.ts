import { useState } from 'react'
import { useAnnouncements } from './useAnnouncements'

export function useInformationCreate(onSave: () => void) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'published' | 'scheduled' | 'draft'>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const { addAnnouncement } = useAnnouncements()

  const handleCreate = () => {
    if (!name.trim()) return
    addAnnouncement(name, content, status, scheduledAt || undefined)
    onSave()
  }

  return { name, setName, content, setContent, status, setStatus, scheduledAt, setScheduledAt, handleCreate }
}
