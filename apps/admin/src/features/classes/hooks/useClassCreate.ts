import { useState } from 'react'
import { useCreateAdminGroupForClassMutation, GetAdminGroupsForClassesDocument } from '@/gql/__generated__/graphql'

export function useClassCreate() {
  const [name, setName] = useState('')
  const [createGroup] = useCreateAdminGroupForClassMutation({
    refetchQueries: [{ query: GetAdminGroupsForClassesDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    await createGroup({ variables: { input: { name: name.slice(0, 64) } } })
    setName('')
  }

  return { name, setName, handleCreate }
}
