export type Announcement = {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
  /** 公開ステータス: published=公開中, scheduled=公開予約, draft=下書き */
  status: 'published' | 'scheduled' | 'draft'
  /** 公開予約日時 (ISO 8601) — status が scheduled のとき使用 */
  scheduledAt?: string
}
