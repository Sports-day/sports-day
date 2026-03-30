import { useState } from 'react'
import { MOCK_IMAGES, persistImages } from '../mock'
import { notifyImageListeners } from './useImages'

export function useImageDetail(imageId: string) {
  const image = MOCK_IMAGES.find((i) => i.id === imageId)
  const [name, setName] = useState(image?.name ?? '')
  const [url, setUrl] = useState(image?.url ?? '')

  const handleSave = () => {
    const i = MOCK_IMAGES.find((i) => i.id === imageId)
    if (i) {
      i.name = name
      i.url = url
    }
    persistImages()
    notifyImageListeners()
  }

  const handleDelete = () => {
    const index = MOCK_IMAGES.findIndex((i) => i.id === imageId)
    if (index !== -1) MOCK_IMAGES.splice(index, 1)
    persistImages()
    notifyImageListeners()
  }

  return { name, setName, url, setUrl, handleSave, handleDelete, imageName: image?.name ?? '' }
}
