import { MOCK_COMPETITIONS } from '../mock'

export function useCompetitions() {
  return { data: MOCK_COMPETITIONS, loading: false, error: null }
}
