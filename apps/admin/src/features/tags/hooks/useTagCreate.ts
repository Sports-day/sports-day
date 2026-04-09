import { useState } from 'react'
import { useCreateAdminSceneForTagMutation, GetAdminScenesForTagsDocument } from '@/gql/__generated__/graphql'

export function useTagCreate() {
  const [name, setName] = useState('')
  const [createScene] = useCreateAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    await createScene({ variables: { input: { name: name.slice(0, 64) } } })
    setName('')
  }

  return { name, setName, handleCreate }
}
