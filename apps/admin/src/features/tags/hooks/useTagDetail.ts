import { useState } from 'react'
import {
  useGetAdminSceneForTagQuery,
  useUpdateAdminSceneForTagMutation,
  useDeleteAdminSceneForTagMutation,
  useRestoreAdminSceneForTagMutation,
  GetAdminScenesForTagsDocument,
} from '@/gql/__generated__/graphql'

export function useTagDetail(tagId: string) {
  const { data, loading, error } = useGetAdminSceneForTagQuery({ variables: { id: tagId } })
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
    await updateScene({ variables: { id: tagId, input: { name: name.slice(0, 64) } } })
    setEditName(null)
  }

  const handleDelete = async () => {
    await deleteScene({ variables: { id: tagId } })
  }

  const handleRestore = async () => {
    await restoreScene({ variables: { id: tagId } })
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
