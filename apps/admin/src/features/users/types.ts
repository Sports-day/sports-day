export type User = {
  id: string
  name: string
  email: string
  gender: '男性' | '女性'
  class: string
  teams: string[]
  role?: string
}
