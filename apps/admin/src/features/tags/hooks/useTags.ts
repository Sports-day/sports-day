import { useState } from 'react'
import { MOCK_TAGS, persistTags } from '../mock'
import type { Tag } from '../types'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS)

  const toggleTag = (id: string) => {
    const tag = MOCK_TAGS.find((t) => t.id === id)
    if (tag) tag.enabled = !tag.enabled
    persistTags()
    setTags([...MOCK_TAGS])
  }

  return { data: tags, loading: false, error: null, toggleTag }
}
