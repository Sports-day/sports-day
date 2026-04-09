import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useCreateAdminCompetitionMutation,
  useGetAdminSportsWithScenesQuery,
  CompetitionType,
} from '@/gql/__generated__/graphql'
import { showErrorToast } from '@/lib/toast'

type CompetitionCreateForm = {
  name: string
  sportId: string
  sceneId: string
  competitionType: CompetitionType | null
}

export function useCompetitionCreate(onSuccess: (id: string, name: string, type: CompetitionType) => void) {
  const [form, setForm] = useState<CompetitionCreateForm>({
    name: '',
    sportId: '',
    sceneId: '',
    competitionType: null,
  })
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [createCompetition] = useCreateAdminCompetitionMutation()
  const { data: sportsData } = useGetAdminSportsWithScenesQuery()
  const allSports = sportsData?.sports ?? []
  const sports = allSports.map(s => ({ id: s.id, name: s.name }))

  // 選択中の競技に紐づくシーンだけをフィルタ
  const selectedSport = allSports.find(s => s.id === form.sportId)
  const scenes = (selectedSport?.scene ?? []).map(ss => ({ id: ss.scene.id, name: ss.scene.name }))

  const handleChange = (field: keyof CompetitionCreateForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.sportId || !form.sceneId || !form.competitionType) return
    try {
      const result = await createCompetition({
        variables: {
          input: {
            name: form.name.slice(0, 64),
            type: form.competitionType,
            sportId: form.sportId,
            sceneId: form.sceneId,
          },
        },
        refetchQueries: ['GetAdminCompetitions'],
      })
      const created = result.data?.createCompetition
      if (!created) return
      setMutationError(null)
      onSuccess(created.id, created.name, created.type)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  const setSportId = (id: string) => {
    setForm(prev => prev.sportId === id ? prev : { ...prev, sportId: id, sceneId: '' })
  }

  return { form, handleChange, handleSubmit, scenes, sports, sportId: form.sportId, setSportId, sceneId: form.sceneId, setSceneId: (id: string) => setForm(prev => ({ ...prev, sceneId: id })), setCompetitionType: (type: CompetitionType | null) => setForm(prev => ({ ...prev, competitionType: type })), error: mutationError }
}
