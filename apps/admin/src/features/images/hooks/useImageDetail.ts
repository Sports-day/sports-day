import { useState, useEffect } from 'react'
import {
  useGetAdminImageQuery,
  useDeleteAdminImageMutation,
  GetAdminImagesDocument,
} from '@/gql/__generated__/graphql'

export function useImageDetail(imageId: string) {
  const { data, loading, error } = useGetAdminImageQuery({ variables: { id: imageId } })
  const image = data?.image

  const [name, setName] = useState('') // 【未確定】GraphQL Image に name はない
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (image?.url !== undefined) setUrl(image.url ?? '')
  }, [image?.url])

  const [deleteImage] = useDeleteAdminImageMutation({
    refetchQueries: [{ query: GetAdminImagesDocument }],
  })

  const handleSave = () => {
    // 【未確定】GraphQL に updateImage ミューテーションはない
  }

  const handleDelete = async () => {
    await deleteImage({ variables: { id: imageId } })
  }

  return {
    name,
    setName,
    url,
    setUrl,
    handleSave,
    handleDelete,
    imageName: '', // 【未確定】GraphQL Image に name はない
    loading,
    error: error ?? null,
  }
}
