import { useState, useEffect } from 'react'
import { MOCK_TAGS, persistTags } from '../mock'
import type { Tag } from '../types'

const _listeners = new Set<() => void>()

export function notifyTagListeners() {
  _listeners.forEach(fn => fn())
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS)

  useEffect(() => {
    const trigger = () => setTags([...MOCK_TAGS])
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  const toggleTag = (id: string) => {
    const tag = MOCK_TAGS.find((t) => t.id === id)
    if (tag) tag.enabled = !tag.enabled
    persistTags()
    setTags([...MOCK_TAGS])
  }

  return { data: tags, loading: false, error: null, toggleTag }
}
