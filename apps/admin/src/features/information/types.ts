export type Announcement = {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
  /** 公開ステータス: published=公開中, draft=下書き */
  status: 'published' | 'draft'
}
