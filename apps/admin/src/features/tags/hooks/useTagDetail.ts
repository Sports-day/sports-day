import { useState } from 'react'
import { MOCK_TAGS } from '../mock'

export function useTagDetail(tagId: string) {
  const tag = MOCK_TAGS.find((t) => t.id === tagId)
  const [name, setName] = useState(tag?.name ?? '')
  const [enabled, setEnabled] = useState(tag?.enabled ?? true)

  const handleSave = () => {
    const t = MOCK_TAGS.find((t) => t.id === tagId)
    if (t) {
      t.name = name
      t.enabled = enabled
    }
  }

  const handleDelete = () => {
    const index = MOCK_TAGS.findIndex((t) => t.id === tagId)
    if (index !== -1) MOCK_TAGS.splice(index, 1)
  }

  return { name, setName, enabled, setEnabled, handleSave, handleDelete, tagName: tag?.name ?? '', loading: false, error: null }
}
