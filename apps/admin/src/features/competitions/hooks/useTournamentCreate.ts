import { useState } from 'react'
import { useGenerateAdminBracketMutation, PlacementMethod } from '@/gql/__generated__/graphql'

export type TournamentCreateForm = {
  name: string
  description: string
  teamCount: number
  placementMethod: 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'
  tag: string
}

const INITIAL_FORM: TournamentCreateForm = {
  name: '',
  description: '',
  teamCount: 4,
  placementMethod: 'SEED_OPTIMIZED',
  tag: '',
}

const PLACEMENT_MAP: Record<TournamentCreateForm['placementMethod'], PlacementMethod> = {
  SEED_OPTIMIZED: PlacementMethod.SeedOptimized,
  BALANCED: PlacementMethod.Balanced,
  RANDOM: PlacementMethod.Random,
  MANUAL: PlacementMethod.Manual,
}

export function useTournamentCreate(competitionId: string, onSave: () => void) {
  const [form, setForm] = useState<TournamentCreateForm>(INITIAL_FORM)
  const [mutationError, setMutationError] = useState<Error | null>(null)
  const [generateBracket] = useGenerateAdminBracketMutation()

  const handleChange =
    (field: keyof TournamentCreateForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'teamCount' ? Number(e.target.value) : e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    if (form.teamCount < 2) return

    try {
      await generateBracket({
        variables: {
          input: {
            competitionId,
            teamCount: form.teamCount,
            placementMethod: PLACEMENT_MAP[form.placementMethod],
          },
        },
        refetchQueries: ['GetAdminTournaments'],
      })
      setMutationError(null)
      onSave()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return { form, handleChange, handleSubmit, error: mutationError }
}
