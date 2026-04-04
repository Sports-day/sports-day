import { useState } from 'react'
import {
  useCreateAdminLeagueMutation,
  useCreateAdminTournamentMutation,
  BracketType,
} from '@/gql/__generated__/graphql'

type CreateForm = {
  name: string
  description: string
  weight: number
  format: string
  scoringFormat: string
  tag: string
}

const INITIAL_FORM: CreateForm = {
  name: '',
  description: '',
  weight: 0,
  format: '',
  scoringFormat: '',
  tag: '',
}

export function useLeagueCreate(competitionId: string, type: 'league' | 'tournament', onSave: () => void) {
  const [form, setForm] = useState<CreateForm>(INITIAL_FORM)
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [createLeague] = useCreateAdminLeagueMutation()
  const [createTournament] = useCreateAdminTournamentMutation()

  const handleChange = (field: keyof CreateForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'weight' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return

    try {
      if (type === 'tournament') {
        await createTournament({
          variables: {
            input: {
              name: form.name,
              competitionId,
              bracketType: BracketType.Main,
            },
          },
          refetchQueries: ['GetAdminTournaments'],
        })
      } else {
        await createLeague({
          variables: {
            input: { name: form.name },
          },
          refetchQueries: ['GetAdminLeagues'],
        })
      }
      setMutationError(null)
      onSave()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return { form, handleChange, handleSubmit, error: mutationError }
}
