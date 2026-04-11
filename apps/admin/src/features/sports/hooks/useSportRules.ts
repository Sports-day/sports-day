import { useState } from 'react'
import {
  useCreateAdminRuleMutation,
  useUpdateAdminRuleMutation,
  useDeleteAdminRuleMutation,
  GetAdminSportDocument,
} from '@/gql/__generated__/graphql'

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
    if (existingRuleId) {
      await updateRule({ variables: { id: existingRuleId, input: { rule: text } } })
    } else {
      await createRule({ variables: { input: { rule: text, sportId } } })
    }
    setIsEditing(false)
    setEditText('')
  }

  const handleDelete = async (ruleId: string) => {
    await deleteRule({ variables: { id: ruleId } })
    setIsEditing(false)
    setEditText('')
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
