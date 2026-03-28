import { MOCK_TEAMS } from '../mock'

export function useTeams() {
  return { data: MOCK_TEAMS, loading: false, error: null }
}
