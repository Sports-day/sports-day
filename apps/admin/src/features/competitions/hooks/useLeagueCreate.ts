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

  const [createLeague] = useCreateAdminLeagueMutation()
  const [createTournament] = useCreateAdminTournamentMutation()

  const handleChange = (field: keyof CreateForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'weight' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return

    if (type === 'tournament') {
      createTournament({
        variables: {
          input: {
            name: form.name,
            competitionId,
            bracketType: BracketType.SingleElimination,
          },
        },
        refetchQueries: ['GetAdminTournaments'],
      }).then(() => onSave()).catch(() => {})
    } else {
      createLeague({
        variables: {
          input: { name: form.name },
        },
        refetchQueries: ['GetAdminLeagues'],
      }).then(() => onSave()).catch(() => {})
    }
  }

  return { form, handleChange, handleSubmit }
}
