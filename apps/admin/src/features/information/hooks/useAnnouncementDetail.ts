import { useState, useEffect } from 'react'
import {
  useGetAdminInformationQuery,
  useUpdateAdminInformationMutation,
  useDeleteAdminInformationMutation,
  GetAdminInformationsDocument,
} from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

export function useAnnouncementDetail(id: string) {
  const { data, loading, error } = useGetAdminInformationQuery({ variables: { id } })
  const item = data?.Information

  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<Announcement['status']>('draft')
  const [scheduledAt, setScheduledAt] = useState('')

  useEffect(() => {
    if (item) {
      setName(item.title)
      setContent(item.content)
      setStatus((item.status as Announcement['status']) ?? 'draft')
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
  }

  const handleDelete = async () => {
    await deleteInformation({ variables: { id } })
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
    error: error ?? null,
  }
}
