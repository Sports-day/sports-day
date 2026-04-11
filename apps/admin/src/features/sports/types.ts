export type SportScene = {
  sceneId: string
  sceneName: string
}

export type Sport = {
  id: string
  name: string
  displayOrder: number
  imageUrl: string
  sceneNames: string[]
  scenes: SportScene[]
}
