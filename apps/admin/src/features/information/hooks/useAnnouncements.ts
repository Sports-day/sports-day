import { MOCK_ANNOUNCEMENTS } from '../mock'

export function useAnnouncements() {
  const addAnnouncement = (name: string, content: string) => {
    MOCK_ANNOUNCEMENTS.push({ id: String(Date.now()), name, content })
  }
  return { data: MOCK_ANNOUNCEMENTS, loading: false, error: null, addAnnouncement }
}
