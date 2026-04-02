import { useState } from 'react'
import {
  useGetAdminLeagueQuery,
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

export function useBulkEdit(_competitionId: string, leagueId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [csvData, setCsvDataRaw] = useState('')
  const [parsedRows, setParsedRows] = useState<BulkEditRow[]>([])

  // 【未確定】 リーグ内の試合一覧は match → league 逆引きが未確定のため空
  const { data: leagueData } = useGetAdminLeagueQuery({
    variables: { id: leagueId },
    skip: !leagueId,
  })
  const [updateMatchResult] = useUpdateAdminMatchResultMutation()

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
    const teams = leagueData?.league?.teams ?? []
    const rows = value
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .flatMap((line) => {
        const parts = line.split(',').map((s) => s.trim())
        const matchId = parts[0] ?? ''
        const scoreA = Number(parts[1] ?? 0)
        const scoreB = Number(parts[2] ?? 0)
        // 【未確定】 match → teamA/teamB の対応は GraphQL では match.entries から取得
        return [{
          matchId,
          teamAName: teams[0]?.name ?? matchId,
          teamBName: teams[1]?.name ?? matchId,
          scoreA,
          scoreB,
        }]
      })
    setParsedRows(rows)
  }

  const execute = async () => {
    for (const row of parsedRows) {
      await updateMatchResult({
        variables: {
          id: row.matchId,
          input: {
            status: MatchStatus.Finished,
            results: [
              // 【未確定】 teamId は match.entries から取得する必要がある
            ],
          },
        },
        refetchQueries: ['GetAdminMatches'],
      }).catch(() => {})
    }
    void filterLocation  // 将来の locationId 設定に備えて保持
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
