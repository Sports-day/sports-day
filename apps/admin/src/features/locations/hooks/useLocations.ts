import { MOCK_LOCATIONS } from '../mock'

export function useLocations() {
  return { data: MOCK_LOCATIONS, loading: false, error: null }
}
