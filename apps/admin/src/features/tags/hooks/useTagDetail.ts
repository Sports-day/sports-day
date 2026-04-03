import { useState, useEffect } from 'react'
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

  const [name, setName] = useState('')

  useEffect(() => {
    if (scene?.name !== undefined) setName(scene.name)
  }, [scene?.name])

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
    await updateScene({ variables: { id: tagId, input: { name } } })
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
    isDeleted: scene?.isDeleted ?? false,
    handleSave,
    handleDelete,
    handleRestore,
    tagName: scene?.name ?? '',
    loading,
    error: error ?? null,
  }
}
