import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useCreateAdminCompetitionMutation,
  useGetAdminScenesQuery,
  CompetitionType,
} from '@/gql/__generated__/graphql'

type CompetitionCreateForm = {
  name: string
  description: string
  icon: string
  tag: string
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
  const { data: scenesData } = useGetAdminScenesQuery()
  const scenes = scenesData?.scenes ?? []

  const handleChange = (field: keyof CompetitionCreateForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
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

  return { form, handleChange, handleSubmit, scenes, sceneId: form.sceneId, setSceneId: (id: string) => setForm(prev => ({ ...prev, sceneId: id })) }
}
