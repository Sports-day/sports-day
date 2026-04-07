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
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [createCompetition] = useCreateAdminCompetitionMutation()
  const { data: scenesData } = useGetAdminScenesQuery()
  const scenes = scenesData?.scenes ?? []

  const handleChange = (field: keyof CompetitionCreateForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    try {
      await createCompetition({
        variables: {
          input: {
            name: form.name,
            type: form.competitionType,
            sceneId: form.sceneId,
          },
        },
        refetchQueries: ['GetAdminCompetitions'],
      })
      setMutationError(null)
      onSuccess(form.name)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return { form, handleChange, handleSubmit, scenes, sceneId: form.sceneId, setSceneId: (id: string) => setForm(prev => ({ ...prev, sceneId: id })), error: mutationError }
}
