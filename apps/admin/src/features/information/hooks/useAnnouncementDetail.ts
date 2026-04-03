import { useState, useEffect } from 'react'
import {
  useGetAdminInformationQuery,
  useUpdateAdminInformationMutation,
  useDeleteAdminInformationMutation,
  GetAdminInformationsDocument,
} from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

const VALID_STATUSES = ['published', 'scheduled', 'draft'] as const

function parseStatus(s: string | null | undefined): Announcement['status'] {
  if (s && (VALID_STATUSES as readonly string[]).includes(s)) {
    return s as Announcement['status']
  }
  return 'draft'
}

export function useAnnouncementDetail(id: string) {
  const { data, loading, error } = useGetAdminInformationQuery({ variables: { id } })
  const item = data?.Information

  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<Announcement['status']>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  useEffect(() => {
    if (item) {
      setName(item.title)
      setContent(item.content)
      setStatus(parseStatus(item.status))
      setScheduledAt(item.scheduledAt ?? '')
    }
  }, [item?.title, item?.content, item?.status, item?.scheduledAt])

  const [updateInformation] = useUpdateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })
  const [deleteInformation] = useDeleteAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleSave = async () => {
    try {
      await updateInformation({
        variables: {
          id,
          input: {
            title: name,
            content,
            status,
            scheduledAt: scheduledAt !== '' ? scheduledAt : undefined,
          },
        },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteInformation({ variables: { id } })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return {
    announcementName: item?.title ?? '',
    name,
    setName,
    content,
    setContent,
    status,
    setStatus,
    scheduledAt,
    setScheduledAt,
    createdAt: '',
    updatedAt: '',
    handleSave,
    handleDelete,
    loading,
    error: error ?? mutationError,
  }
}
