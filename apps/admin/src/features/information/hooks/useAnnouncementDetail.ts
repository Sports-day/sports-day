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
  const [status, setStatus] = useState<Announcement['status']>('draft') // 【未確定】GQL に status はない
  const [scheduledAt, setScheduledAt] = useState('') // 【未確定】GQL に scheduledAt はない

  useEffect(() => {
    if (item) {
      setName(item.title)
      setContent(item.content)
    }
  }, [item?.title, item?.content])

  const [updateInformation] = useUpdateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })
  const [deleteInformation] = useDeleteAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleSave = async () => {
    await updateInformation({ variables: { id, input: { title: name, content } } })
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
    createdAt: '', // 【未確定】GQL に createdAt はない
    updatedAt: '', // 【未確定】GQL に updatedAt はない
    handleSave,
    handleDelete,
    loading,
    error: error ?? null,
  }
}
