import { useState } from 'react'
import { useCreateAdminInformationMutation, GetAdminInformationsDocument } from '@/gql/__generated__/graphql'

export function useInformationCreate(onSave: () => void) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'published' | 'scheduled' | 'draft'>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [createInformation] = useCreateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      await createInformation({
        variables: {
          input: {
            title: name,
            content,
            status,
            scheduledAt: scheduledAt !== '' ? scheduledAt : undefined,
          },
        },
      })
      setMutationError(null)
      onSave()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return { name, setName, content, setContent, status, setStatus, scheduledAt, setScheduledAt, handleCreate, error: mutationError }
}
