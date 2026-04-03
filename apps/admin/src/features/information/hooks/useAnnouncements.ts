import { useGetAdminInformationsQuery } from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

function parseStatus(s: string | null | undefined): Announcement['status'] {
  if (s === 'published') return 'published'
  return 'draft'
}

export function useAnnouncements() {
  const { data, loading, error } = useGetAdminInformationsQuery()
  const announcements: Announcement[] = (data?.Informations ?? []).map(i => ({
    id: i.id,
    name: i.title,
    content: i.content,
    createdAt: '',
    updatedAt: '',
    status: parseStatus(i.status),
  }))
  return { data: announcements, loading, error: error ?? null }
}
