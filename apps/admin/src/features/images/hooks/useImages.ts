import { MOCK_IMAGES } from '../mock'

export function useImages() {
  return { data: MOCK_IMAGES, loading: false, error: null }
}
