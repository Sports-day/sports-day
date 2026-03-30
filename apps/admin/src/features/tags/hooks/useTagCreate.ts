import { useState } from 'react'
import { MOCK_TAGS, persistTags } from '../mock'

export function useTagCreate() {
  const [name, setName] = useState('')

  const handleCreate = () => {
    const newId = String(Date.now())
    MOCK_TAGS.push({ id: newId, name, enabled: true })
    persistTags()
    setName('')
  }

  return { name, setName, handleCreate }
}
