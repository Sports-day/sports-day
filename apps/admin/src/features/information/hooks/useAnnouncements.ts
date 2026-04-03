import { useGetAdminInformationsQuery } from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

export function useAnnouncements() {
  const { data, loading, error } = useGetAdminInformationsQuery()
  const announcements: Announcement[] = (data?.Informations ?? []).map(i => ({
    id: i.id,
    name: i.title,
    content: i.content,
    createdAt: '',
    updatedAt: '',
    status: (i.status as Announcement['status']) ?? 'draft',
    scheduledAt: i.scheduledAt ?? undefined,
  }))
  return { data: announcements, loading, error: error ?? null }
}
