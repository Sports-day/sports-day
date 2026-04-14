import { useState } from 'react'
import { useCreateAdminSceneForTagMutation, GetAdminScenesForTagsDocument } from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

export function useTagCreate() {
  const [name, setName] = useState('')
  const [createScene] = useCreateAdminSceneForTagMutation({
    refetchQueries: [{ query: GetAdminScenesForTagsDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      await createScene({ variables: { input: { name: name.slice(0, 64) } } })
      setName('')
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  return { name, setName, handleCreate }
}
