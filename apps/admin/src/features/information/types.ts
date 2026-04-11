export type Announcement = {
  id: string
  title: string
  content: string
  status: 'published' | 'draft'
  displayOrder: number
}
