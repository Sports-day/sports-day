import { useState, useEffect } from 'react'
import {
  useGetAdminSceneForTagQuery,
  useUpdateAdminSceneForTagMutation,
  useDeleteAdminSceneForTagMutation,
  GetAdminScenesForTagsDocument,
} from '@/gql/__generated__/graphql'

export function useTagDetail(tagId: string) {
  const { data, loading, error } = useGetAdminSceneForTagQuery({ variables: { id: tagId } })
  const scene = data?.scene

  const [name, setName] = useState('')
  const [enabled, setEnabled] = useState(true) // 【未確定】GraphQL Scene に enabled はない

  useEffect(() => {
    if (scene?.name !== undefined) setName(scene.name)
  }, [scene?.name])

  const [updateScene] = useUpdateAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })
  const [deleteScene] = useDeleteAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })

  const handleSave = async () => {
    await updateScene({ variables: { id: tagId, input: { name } } })
  }

  const handleDelete = async () => {
    await deleteScene({ variables: { id: tagId } })
  }

  return {
    name,
    setName,
    enabled,
    setEnabled,
    handleSave,
    handleDelete,
    tagName: scene?.name ?? '',
    loading,
    error: error ?? null,
  }
}
