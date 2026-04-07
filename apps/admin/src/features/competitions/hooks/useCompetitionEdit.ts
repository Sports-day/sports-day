import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminCompetitionQuery,
  useGetAdminTournamentsQuery,
  useUpdateAdminCompetitionMutation,
  useDeleteAdminCompetitionMutation,
} from '@/gql/__generated__/graphql'

type EditForm = {
  name: string
}

export function useCompetitionEdit(competitionId: string) {
  const { data, loading, error } = useGetAdminCompetitionQuery({
    variables: { id: competitionId },
    skip: !competitionId,
  })
  const { data: tournamentsData } = useGetAdminTournamentsQuery({
    variables: { competitionId },
    skip: !competitionId,
  })
  const competition = data?.competition

  const [form, setForm] = useState<EditForm>({ name: '' })
  const [mutationError, setMutationError] = useState<Error | null>(null)

  useEffect(() => {
    if (competition) {
      setForm({ name: competition.name })
    }
  }, [competition])

  const [updateCompetition] = useUpdateAdminCompetitionMutation()
  const [deleteCompetition] = useDeleteAdminCompetitionMutation()

  const handleChange = (field: keyof EditForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    try {
      await updateCompetition({
        variables: {
          id: competitionId,
          input: { name: form.name.trim() },
        },
        refetchQueries: ['GetAdminCompetitions', 'GetAdminCompetition'],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCompetition({
        variables: { id: competitionId },
        refetchQueries: ['GetAdminCompetitions'],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const leagues = competition?.league ? [competition.league] : []
  const tournaments = tournamentsData?.tournaments ?? []
  const competitionType = competition?.type ?? null
  const sceneName = competition?.scene?.name ?? ''

  return {
    form,
    handleChange,
    handleSave,
    handleDelete,
    leagues,
    tournaments,
    competitionType,
    sceneName,
    loading,
    error: error ?? mutationError,
  }
}
