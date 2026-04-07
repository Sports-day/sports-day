import { useState, useEffect, useRef } from 'react'
import {
  useGetAdminTournamentQuery,
  useUpdateAdminTournamentMutation,
  useDeleteAdminTournamentMutation,
  GetAdminTournamentsDocument,
} from '@/gql/__generated__/graphql'

type PlacementMethod = 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'

export function useTournamentEdit(tournamentId: string) {
  const { data } = useGetAdminTournamentQuery({
    variables: { id: tournamentId },
    skip: !tournamentId,
  })
  const tournament = data?.tournament

  const [name, setName] = useState(tournament?.name ?? '')
  const [teamCount, setTeamCount] = useState(tournament?.slots.length ?? 4)
  const [placementMethod, setPlacementMethod] = useState<PlacementMethod>(
    (tournament?.placementMethod ?? 'SEED_OPTIMIZED') as PlacementMethod
  )

  const initialName = useRef('')

  useEffect(() => {
    if (tournament?.name !== undefined) {
      setName(tournament.name)
      initialName.current = tournament.name
    }
  }, [tournament?.name])

  useEffect(() => {
    if (tournament?.slots !== undefined) setTeamCount(tournament.slots.length)
  }, [tournament?.slots])

  useEffect(() => {
    if (tournament?.placementMethod !== undefined) {
      setPlacementMethod(tournament.placementMethod as PlacementMethod)
    }
  }, [tournament?.placementMethod])

  const dirty = name !== initialName.current

  const [updateTournament] = useUpdateAdminTournamentMutation()
  const [deleteTournament] = useDeleteAdminTournamentMutation({
    refetchQueries: tournament?.competition?.id
      ? [{ query: GetAdminTournamentsDocument, variables: { competitionId: tournament.competition.id } }]
      : [],
  })

  const handleChange =
    (field: 'name' | 'teamCount' | 'placementMethod') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === 'name') setName(e.target.value)
      else if (field === 'teamCount') setTeamCount(Number(e.target.value))
      else if (field === 'placementMethod') setPlacementMethod(e.target.value as PlacementMethod)
    }

  const handleSave = async () => {
    await updateTournament({
      variables: { id: tournamentId, input: { name } },
    })
  }

  const handleDelete = async () => {
    await deleteTournament({ variables: { id: tournamentId } })
  }

  return {
    name,
    dirty,
    teamCount,
    placementMethod,
    handleChange,
    handleSave,
    handleDelete,
  }
}
