import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useCreateAdminCompetitionMutation,
  CompetitionType,
} from '@/gql/__generated__/graphql'

type CompetitionCreateForm = {
  name: string
  description: string
  icon: string
  tag: string
  // 【未確定】 GraphQL API に合わせた項目 — UI 側の対応は後続タスク
  sceneId: string
  competitionType: CompetitionType
}

export function useCompetitionCreate(onSuccess: (name: string) => void) {
  const [form, setForm] = useState<CompetitionCreateForm>({
    name: '',
    description: '',
    icon: '',
    tag: '',
    sceneId: '',
    competitionType: CompetitionType.League,
  })

  const [createCompetition] = useCreateAdminCompetitionMutation()

  const handleChange = (field: keyof CompetitionCreateForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    // 【未確定】 sceneId は scenes クエリから取得する UI が必要
    createCompetition({
      variables: {
        input: {
          name: form.name,
          type: form.competitionType,
          sceneId: form.sceneId,
        },
      },
      refetchQueries: ['GetAdminCompetitions'],
    }).then(() => {
      onSuccess(form.name)
    }).catch(() => {
      // エラーハンドリングは後続タスクで対応
    })
  }

  return { form, handleChange, handleSubmit }
}
