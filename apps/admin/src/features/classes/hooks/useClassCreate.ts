import { useState } from 'react'
import { useCreateAdminGroupForClassMutation, GetAdminGroupsForClassesDocument } from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

export function useClassCreate() {
  const [name, setName] = useState('')
  const [createGroup] = useCreateAdminGroupForClassMutation({
    refetchQueries: [{ query: GetAdminGroupsForClassesDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      await createGroup({ variables: { input: { name: name.slice(0, 64) } } })
      setName('')
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  return { name, setName, handleCreate }
}
