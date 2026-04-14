import { useState } from 'react'
import {
  useGetAdminInformationQuery,
  useUpdateAdminInformationMutation,
  useDeleteAdminInformationMutation,
  GetAdminInformationsDocument,
} from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'
import type { Announcement } from '../types'

function parseStatus(s: string | null | undefined): Announcement['status'] {
  if (s === 'published') return 'published'
  return 'draft'
}

export function useAnnouncementDetail(id: string) {
  const { data, loading, error } = useGetAdminInformationQuery({ variables: { id }, fetchPolicy: 'cache-and-network' })
  const item = data?.Information

  // サーバー値 + 編集差分パターン
  const serverTitle = item?.title ?? ''
  const serverContent = item?.content ?? ''
  const serverStatus = parseStatus(item?.status)

  const [editTitle, setEditTitle] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<Announcement['status'] | null>(null)
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const title = editTitle ?? serverTitle
  const content = editContent ?? serverContent
  const status = editStatus ?? serverStatus

  const setTitle = (v: string) => setEditTitle(v)
  const setContent = (v: string) => setEditContent(v)
  const setStatus = (v: Announcement['status']) => setEditStatus(v)

  const dirty = editTitle !== null || editContent !== null || editStatus !== null

  const [updateInformation] = useUpdateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })
  const [deleteInformation] = useDeleteAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return
    try {
      await updateInformation({
        variables: { id, input: { title: title.slice(0, 64), content: content.slice(0, 1000), status } },
      })
      setEditTitle(null)
      setEditContent(null)
      setEditStatus(null)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
      throw e
    }
  }

  const handleDelete = async () => {
    try {
      await deleteInformation({ variables: { id } })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
      throw e
    }
  }

  return {
    announcementTitle: item?.title ?? '',
    title,
    setTitle,
    content,
    setContent,
    status,
    setStatus,
    dirty,
    handleSave,
    handleDelete,
    loading,
    error: error ?? mutationError,
  }
}
