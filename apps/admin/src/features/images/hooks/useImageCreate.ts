import { useState } from 'react'
import { MOCK_IMAGES, persistImages } from '../mock'
import { notifyImageListeners } from './useImages'

export function useImageCreate() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = () => {
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) return
    } catch {
      return
    }
    MOCK_IMAGES.push({ id: String(Date.now()), name, url })
    persistImages()
    notifyImageListeners()
    setName('')
    setUrl('')
  }

  return { name, setName, url, setUrl, handleCreate }
}
