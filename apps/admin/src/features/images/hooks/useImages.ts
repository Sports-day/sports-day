import { MOCK_IMAGES } from '../mock'

export function useImages() {
  const addImage = (name: string, url: string) => {
    MOCK_IMAGES.push({ id: String(Date.now()), name, url })
  }
  return { data: MOCK_IMAGES, loading: false, error: null, addImage }
}
