import { useGetAdminInformationsQuery } from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

export function useAnnouncements() {
  const { data, loading, error } = useGetAdminInformationsQuery()
  const announcements: Announcement[] = (data?.Informations ?? []).map(i => ({
    id: i.id,
    name: i.title,
    content: i.content,
    createdAt: '', // 【未確定】GraphQL Information に createdAt はない
    updatedAt: '', // 【未確定】GraphQL Information に updatedAt はない
    status: 'published' as Announcement['status'], // 【未確定】GraphQL Information に status はない
    scheduledAt: undefined,
  }))
  return { data: announcements, loading, error: error ?? null }
}
