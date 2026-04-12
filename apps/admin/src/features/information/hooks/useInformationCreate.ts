import { useState } from 'react'
import { useCreateAdminInformationMutation, GetAdminInformationsDocument } from '@/gql/__generated__/graphql'
import { showErrorToast } from '@/lib/toast'

export function useInformationCreate(onSave: () => void) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('draft')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [createInformation] = useCreateAdminInformationMutation({
    refetchQueries: [{ query: GetAdminInformationsDocument }],
  })

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return
    try {
      await createInformation({
        variables: { input: { title: title.slice(0, 64), content: content.slice(0, 1000), status } },
      })
      setMutationError(null)
      onSave()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
      throw e
    }
  }

  return { title, setTitle, content, setContent, status, setStatus, handleCreate, error: mutationError }
}
