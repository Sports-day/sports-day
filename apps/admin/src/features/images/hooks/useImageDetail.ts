import { useState } from 'react'
import {
  useGetAdminImageQuery,
  useDeleteAdminImageMutation,
  GetAdminImagesDocument,
} from '@/gql/__generated__/graphql'
import { showErrorToast } from '@/lib/toast'

export function useImageDetail(imageId: string) {
  const { data, loading, error } = useGetAdminImageQuery({ variables: { id: imageId } })
  const image = data?.image

  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [deleteImage] = useDeleteAdminImageMutation({
    refetchQueries: [{ query: GetAdminImagesDocument }],
  })

  const handleDelete = async () => {
    try {
      await deleteImage({ variables: { id: imageId } })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  return {
    url: image?.url ?? '',
    status: image?.status ?? '',
    handleDelete,
    loading,
    error: error ?? mutationError,
  }
}
