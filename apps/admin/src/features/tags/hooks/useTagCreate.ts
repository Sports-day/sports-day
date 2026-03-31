import { useState } from 'react'
import { MOCK_TAGS, persistTags } from '../mock'
import { notifyTagListeners } from './useTags'

export function useTagCreate() {
  const [name, setName] = useState('')

  const handleCreate = () => {
    const newId = String(Date.now())
    MOCK_TAGS.push({ id: newId, name, enabled: true })
    persistTags()
    notifyTagListeners()
    setName('')
  }

  return { name, setName, handleCreate }
}
