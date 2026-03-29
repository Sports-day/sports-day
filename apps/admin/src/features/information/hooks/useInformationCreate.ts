import { useState } from 'react'
import { useAnnouncements } from './useAnnouncements'

export function useInformationCreate(onSave: () => void) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const { addAnnouncement } = useAnnouncements()

  const handleCreate = () => {
    if (!name.trim()) return
    addAnnouncement(name, content)
    onSave()
  }

  return { name, setName, content, setContent, handleCreate }
}
