import { MOCK_USERS } from '../mock'

export function useUsers() {
  return { data: MOCK_USERS, loading: false, error: null }
}
