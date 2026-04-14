import { useState } from 'react'
import {
  useGetAdminSceneForTagQuery,
  useUpdateAdminSceneForTagMutation,
  useDeleteAdminSceneForTagMutation,
  useRestoreAdminSceneForTagMutation,
  GetAdminScenesForTagsDocument,
} from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

export function useTagDetail(tagId: string) {
  const { data, loading, error } = useGetAdminSceneForTagQuery({ variables: { id: tagId }, fetchPolicy: 'cache-and-network' })
  const scene = data?.scene

  // サーバー値 + 編集差分パターン
  const serverName = scene?.name ?? ''
  const [editName, setEditName] = useState<string | null>(null)
  const name = editName ?? serverName
  const setName = (v: string) => setEditName(v)
  const dirty = editName !== null

  const [updateScene] = useUpdateAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })
  const [deleteScene] = useDeleteAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })
  const [restoreScene] = useRestoreAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })

  const handleSave = async () => {
    if (!name.trim()) return
    try {
      await updateScene({ variables: { id: tagId, input: { name: name.slice(0, 64) } } })
      setEditName(null)
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  const handleDelete = async () => {
    try {
      await deleteScene({ variables: { id: tagId } })
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  const handleRestore = async () => {
    try {
      await restoreScene({ variables: { id: tagId } })
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  return {
    name,
    setName,
    dirty,
    isDeleted: scene?.isDeleted ?? false,
    handleSave,
    handleDelete,
    handleRestore,
    tagName: scene?.name ?? '',
    loading,
    error: error ?? null,
  }
}
