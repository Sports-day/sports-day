export type User = {
  id: string
  name: string
  email: string
  gender: string
  groupName: string
  teams: { id: string; name: string }[]
}
