import { useState } from 'react'
import {
  useCreateAdminRuleMutation,
  useUpdateAdminRuleMutation,
  useDeleteAdminRuleMutation,
  GetAdminSportDocument,
} from '@/gql/__generated__/graphql'
import { showErrorToast } from '@/lib/toast'

export function useSportRules(sportId: string) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

  const refetchOpts = { refetchQueries: [{ query: GetAdminSportDocument, variables: { id: sportId } }] }

  const [createRule] = useCreateAdminRuleMutation(refetchOpts)
  const [updateRule] = useUpdateAdminRuleMutation(refetchOpts)
  const [deleteRule] = useDeleteAdminRuleMutation(refetchOpts)

  const handleStartEdit = (currentText: string) => {
    setEditText(currentText)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditText('')
  }

  const handleSave = async (existingRuleId: string | null) => {
    const text = editText.trim()
    if (!text) return
    try {
      if (existingRuleId) {
        await updateRule({ variables: { id: existingRuleId, input: { rule: text } } })
      } else {
        await createRule({ variables: { input: { rule: text, sportId } } })
      }
      setIsEditing(false)
      setEditText('')
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  const handleDelete = async (ruleId: string) => {
    try {
      await deleteRule({ variables: { id: ruleId } })
      setIsEditing(false)
      setEditText('')
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  return {
    isEditing,
    editText,
    setEditText,
    handleStartEdit,
    handleCancel,
    handleSave,
    handleDelete,
  }
}
