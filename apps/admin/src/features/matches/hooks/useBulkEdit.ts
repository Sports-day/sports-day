import { useState } from 'react'
import {
  useGetAdminCompetitionMatchesQuery,
  useUpdateAdminMatchResultMutation,
  MatchStatus,
} from '@/gql/__generated__/graphql'

export type BulkEditRow = {
  matchId: string
  teamAName: string
  teamBName: string
  scoreA: number
  scoreB: number
}

export function useBulkEdit(competitionId: string, _leagueId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [csvData, setCsvDataRaw] = useState('')
  const [parsedRows, setParsedRows] = useState<BulkEditRow[]>([])
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const { data: compMatchesData } = useGetAdminCompetitionMatchesQuery({
    variables: { competitionId },
    skip: !competitionId,
  })
  const [updateMatchResult] = useUpdateAdminMatchResultMutation()

  const compMatches = compMatchesData?.competition?.matches ?? []

  const open = () => setIsOpen(true)
  const close = () => {
    setIsOpen(false)
    setFilterDate('')
    setFilterLocation('')
    setCsvDataRaw('')
    setParsedRows([])
  }

  const setCsvData = (value: string) => {
    setCsvDataRaw(value)
    const matchTeamMap = new Map(compMatches.map(m => [
      m.id,
      { teamAName: m.entries[0]?.team?.name ?? '', teamBName: m.entries[1]?.team?.name ?? '' },
    ]))
    const rows = value
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((line) => {
        const parts = line.split(',').map((s) => s.trim())
        const matchId = parts[0] ?? ''
        const scoreA = Number(parts[1] ?? 0)
        const scoreB = Number(parts[2] ?? 0)
        const teams = matchTeamMap.get(matchId)
        return {
          matchId,
          teamAName: teams?.teamAName ?? matchId,
          teamBName: teams?.teamBName ?? matchId,
          scoreA,
          scoreB,
        }
      })
    setParsedRows(rows)
  }

  const execute = async () => {
    try {
      for (const row of parsedRows) {
        const match = compMatches.find(m => m.id === row.matchId)
        const results = (match?.entries ?? [])
          .map((e, i) => ({
            teamId: e.team?.id ?? '',
            score: i === 0 ? row.scoreA : row.scoreB,
          }))
          .filter(r => r.teamId)
        await updateMatchResult({
          variables: {
            id: row.matchId,
            input: { status: MatchStatus.Finished, results },
          },
          refetchQueries: ['GetAdminCompetitionMatches'],
        })
      }
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
    close()
  }

  return {
    isOpen,
    filterDate,
    setFilterDate,
    filterLocation,
    setFilterLocation,
    csvData,
    setCsvData,
    parsedRows,
    open,
    close,
    execute,
    error: mutationError,
  }
}
