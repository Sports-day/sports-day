import { useState } from 'react'
import { MOCK_IMAGES } from '../mock'

export function useImageCreate() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = () => {
    MOCK_IMAGES.push({ id: String(Date.now()), name, url })
    setName('')
    setUrl('')
  }

  return { name, setName, url, setUrl, handleCreate }
}
