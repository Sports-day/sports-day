import { useState } from 'react'
import { useCreateAdminImageUploadUrlMutation, GetAdminImagesDocument } from '@/gql/__generated__/graphql'

export function useImageCreate() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const [createImageUploadUrl] = useCreateAdminImageUploadUrlMutation({
    refetchQueries: [{ query: GetAdminImagesDocument }],
  })

  const handleCreate = async () => {
    if (!name.trim()) return
    // 【未確定】S3プレサインドURLフロー未実装。filename を name から生成して uploadUrl を取得後、
    // PUT でファイルをアップロードする UI への移行が必要。
    await createImageUploadUrl({ variables: { input: { filename: name } } })
    setName('')
    setUrl('')
  }

  return { name, setName, url, setUrl, handleCreate }
}
