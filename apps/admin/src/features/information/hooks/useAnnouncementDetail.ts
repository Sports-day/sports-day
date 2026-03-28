import { useState } from 'react'
import { MOCK_ANNOUNCEMENTS } from '../mock'

export function useAnnouncementDetail(id: string) {
  const item = MOCK_ANNOUNCEMENTS.find(a => a.id === id)
  const [name, setName] = useState(item?.name ?? '')
  const [content, setContent] = useState(item?.content ?? '')

  const handleSave = () => {
    const target = MOCK_ANNOUNCEMENTS.find(a => a.id === id)
    if (target) {
      target.name = name
      target.content = content
    }
  }

  const handleDelete = () => {
    const index = MOCK_ANNOUNCEMENTS.findIndex(a => a.id === id)
    if (index !== -1) MOCK_ANNOUNCEMENTS.splice(index, 1)
  }

  return {
    announcementName: item?.name ?? '',
    name,
    setName,
    content,
    setContent,
    handleSave,
    handleDelete,
    loading: false,
    error: null,
  }
}
