import { useState } from 'react'
import { MOCK_TAGS } from '../mock'

export function useTagCreate() {
  const [name, setName] = useState('')

  const handleCreate = () => {
    const newId = String(MOCK_TAGS.length + 1)
    MOCK_TAGS.push({ id: newId, name, enabled: true })
    setName('')
  }

  return { name, setName, handleCreate }
}
