import { useState, useRef } from 'react'
import { useCreateAdminImageUploadUrlMutation, GetAdminImagesDocument } from '@/gql/__generated__/graphql'

export function useImageCreate(onSuccess?: () => void) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [createImageUploadUrl] = useCreateAdminImageUploadUrlMutation({
    refetchQueries: [{ query: GetAdminImagesDocument }],
  })

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
    setError(null)
  }

  const handleCreate = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      // 1. プレサインドURL取得
      const { data } = await createImageUploadUrl({
        variables: { input: { filename: file.name } },
      })
      const uploadUrl = data?.createImageUploadURL?.uploadUrl
      if (!uploadUrl) throw new Error('アップロードURLの取得に失敗しました')

      // 2. S3にファイルをPUTアップロード
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      })
      if (!response.ok) throw new Error(`アップロードに失敗しました: ${response.status}`)

      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setUploading(false)
    }
  }

  return { file, fileInputRef, handleFileSelect, handleCreate, uploading, error }
}
