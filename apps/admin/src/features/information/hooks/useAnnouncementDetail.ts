import { useState, useEffect } from 'react'
import {
  useGetAdminInformationQuery,
  useUpdateAdminInformationMutation,
  useDeleteAdminInformationMutation,
  GetAdminInformationsDocument,
} from '@/gql/__generated__/graphql'
import type { Announcement } from '../types'

function parseStatus(s: string | null | undefined): Announcement['status'] {
  if (s === 'published') return 'published'
  return 'draft'
}

export function useAnnouncementDetail(id: string) {
  const { data, loading, error } = useGetAdminInformationQuery({ variables: { id } })
  const item = data?.Information

  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<Announcement['status']>('draft')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  useEffect(() => {
    if (item) {
      setName(item.title)
      setContent(item.content)
      setStatus(parseStatus(item.status))
    }
  }, [item?.title, item?.content, item?.status])

  const [updateInformation] = useUpdateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })
  const [deleteInformation] = useDeleteAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleSave = async () => {
    try {
      await updateInformation({
        variables: { id, input: { title: name, content, status } },
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
    createdAt: '',
    updatedAt: '',
    handleSave,
    handleDelete,
    loading,
    error: error ?? mutationError,
  }
}
