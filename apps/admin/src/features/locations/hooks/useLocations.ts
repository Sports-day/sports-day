import { useLocationsStore } from './useLocationsStore'

export function useLocations() {
  const { locations } = useLocationsStore()
  return { data: locations, loading: false, error: null }
}
