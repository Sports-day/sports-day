export type Team = {
  id: string
  name: string
  class: string
  tags: string[]
}

export type TeamMember = {
  studentId: string
  name: string
  gender: '男性' | '女性'
}

export type SelectableUser = {
  id: string
  userName: string
  gender: '男性' | '女性'
  studentId: string
}
