export type Team = {
  id: string
  name: string
  groupName: string
}

export type TeamMember = {
  id: string
  name: string
}

export type SelectableUser = {
  id: string
  userName: string
  email: string
}

export type SportSceneRow = {
  sportSceneId: string
  sceneId: string
  sceneName: string
  entryId: string | null
  isRegistered: boolean
}

export type SportGroup = {
  sportId: string
  sportName: string
  scenes: SportSceneRow[]
}
