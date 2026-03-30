import type { Announcement } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_ANNOUNCEMENTS: Announcement[] = loadFromStorage('admin_announcements', [
  { id: '1', name: '開会式のお知らせ', content: '開会式は9:00から行います。参加者は8:45までに集合してください。' },
  { id: '2', name: 'スケジュール変更', content: '午後の試合スケジュールが一部変更になりました。最新情報を確認してください。' },
  { id: '3', name: '閉会式について', content: '閉会式は17:00から体育館にて行います。全員参加をお願いします。' },
])

export function persistAnnouncements() {
  saveToStorage('admin_announcements', MOCK_ANNOUNCEMENTS)
}
