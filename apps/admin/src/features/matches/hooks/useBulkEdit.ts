import { useState } from 'react'
import { MOCK_ACTIVE_LEAGUES, persistActiveLeagues } from '../mock'

export type BulkEditRow = {
  matchId: string
  teamAName: string
  teamBName: string
  scoreA: number
  scoreB: number
}

export function useBulkEdit(competitionId: string, leagueId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [csvData, setCsvDataRaw] = useState('')
  const [parsedRows, setParsedRows] = useState<BulkEditRow[]>([])

  const getLeague = () =>
    (MOCK_ACTIVE_LEAGUES[competitionId] ?? []).find((l) => l.id === leagueId)

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
    const league = getLeague()
    if (!league) { setParsedRows([]); return }
    const rows = value
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .flatMap((line) => {
        const parts = line.split(',').map((s) => s.trim())
        const matchId = parts[0] ?? ''
        const scoreA = Number(parts[1] ?? 0)
        const scoreB = Number(parts[2] ?? 0)
        const match = league.matches.find((m) => m.id === matchId)
        if (!match) return []
        const teamA = league.teams.find((t) => t.id === match.teamAId)
        const teamB = league.teams.find((t) => t.id === match.teamBId)
        return [{
          matchId,
          teamAName: teamA?.shortName ?? match.teamAId,
          teamBName: teamB?.shortName ?? match.teamBId,
          scoreA,
          scoreB,
        }]
      })
    setParsedRows(rows)
  }

  const execute = () => {
    const league = getLeague()
    if (!league) return
    parsedRows.forEach((row) => {
      const match = league.matches.find((m) => m.id === row.matchId)
      if (match) {
        match.scoreA = row.scoreA
        match.scoreB = row.scoreB
        if (filterLocation) match.location = filterLocation
      }
    })
    persistActiveLeagues()
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
  }
}
