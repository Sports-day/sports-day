import type { Image } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_IMAGES: Image[] = loadFromStorage('admin_images', [
  { id: '1', name: 'ロゴ画像', url: 'https://via.placeholder.com/200x200?text=Logo' },
  { id: '2', name: '背景画像', url: 'https://via.placeholder.com/800x400?text=Background' },
  { id: '3', name: 'バナー画像', url: 'https://via.placeholder.com/600x200?text=Banner' },
])

export function persistImages() {
  saveToStorage('admin_images', MOCK_IMAGES)
}
