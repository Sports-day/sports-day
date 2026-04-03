import { useState } from 'react'
import { useCreateAdminInformationMutation, GetAdminInformationsDocument } from '@/gql/__generated__/graphql'

export function useInformationCreate(onSave: () => void) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('draft')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [createInformation] = useCreateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      await createInformation({
        variables: { input: { title: name, content, status } },
      })
      setMutationError(null)
      onSave()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return { name, setName, content, setContent, status, setStatus, handleCreate, error: mutationError }
}
