import { useGetAdminInformationsQuery } from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

const VALID_STATUSES = ['published', 'scheduled', 'draft'] as const

function parseStatus(s: string | null | undefined): Announcement['status'] {
  if (s && (VALID_STATUSES as readonly string[]).includes(s)) {
    return s as Announcement['status']
  }
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
    scheduledAt: i.scheduledAt ?? undefined,
  }))
  return { data: announcements, loading, error: error ?? null }
}
