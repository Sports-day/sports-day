import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminCompetitionQuery,
  useUpdateAdminCompetitionMutation,
  useDeleteAdminCompetitionMutation,
} from '@/gql/__generated__/graphql'

type EditForm = {
  name: string
  description: string
  icon: string
  tag: string
}

export function useCompetitionEdit(competitionId: string) {
  const { data } = useGetAdminCompetitionQuery({
    variables: { id: competitionId },
    skip: !competitionId,
  })
  const competition = data?.competition

  const [form, setForm] = useState<EditForm>({
    name: competition?.name ?? '',
    description: '',
    icon: competition?.type.toLowerCase() ?? '',
    tag: competition?.scene.name ?? '',
  })

  const [updateCompetition] = useUpdateAdminCompetitionMutation()
  const [deleteCompetition] = useDeleteAdminCompetitionMutation()

  const handleChange = (field: keyof EditForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    updateCompetition({
      variables: {
        id: competitionId,
        input: { name: form.name.trim() },
      },
      refetchQueries: ['GetAdminCompetitions', 'GetAdminCompetition'],
    }).catch(() => {
      // エラーハンドリングは後続タスクで対応
    })
  }

  const handleDelete = () => {
    deleteCompetition({
      variables: { id: competitionId },
      refetchQueries: ['GetAdminCompetitions'],
    }).catch(() => {
      // エラーハンドリングは後続タスクで対応
    })
  }

  return { form, handleChange, handleSave, handleDelete }
}
