import type { Tag } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_TAGS: Tag[] = loadFromStorage('admin_tags', [
  { id: '1', name: '晴天時', enabled: true },
  { id: '2', name: '雨天時', enabled: true },
])

export function persistTags() {
  saveToStorage('admin_tags', MOCK_TAGS)
}
