export type User = {
  id: string
  name: string
  email: string
  role: string
  groupName: string
  teams: { id: string; name: string }[]
  experiencedSports: string[]
  microsoftUserId?: string | null
}
