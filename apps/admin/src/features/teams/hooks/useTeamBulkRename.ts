import { useState } from 'react'
import { useGetAdminTeamsQuery, useUpdateAdminTeamMutation } from '@/gql/__generated__/graphql'

export type BulkRenameRow = {
  id: string
  beforeName: string
  afterName: string
  status: '待機中' | '成功' | 'エラー'
  errorReason?: string
}

export function useTeamBulkRename() {
  const [csvText, setCsvText] = useState('')
  const [rows, setRows] = useState<BulkRenameRow[]>([])
  const [executed, setExecuted] = useState(false)

  const { data: teamsData } = useGetAdminTeamsQuery()
  const [updateTeam] = useUpdateAdminTeamMutation()

  const handleCsvChange = (value: string) => {
    setCsvText(value)
    setExecuted(false)

    const teams = teamsData?.teams ?? []
    const parsed: BulkRenameRow[] = value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const commaIndex = line.indexOf(',')
        const id = commaIndex !== -1 ? line.slice(0, commaIndex).trim() : line.trim()
        const afterName = commaIndex !== -1 ? line.slice(commaIndex + 1).trim() : ''
        const team = teams.find((t) => t.id === id)
        return {
          id: id ?? '',
          beforeName: team?.name ?? '(不明)',
          afterName: afterName ?? '',
          status: '待機中' as const,
        }
      })

    setRows(parsed)
  }

  const handleExecute = async () => {
    const teams = teamsData?.teams ?? []
    const updated: BulkRenameRow[] = []

    for (const row of rows) {
      const team = teams.find((t) => t.id === row.id)
      if (!team) {
        updated.push({ ...row, status: 'エラー', errorReason: 'IDが見つかりません' })
        continue
      }
      if (!row.afterName) {
        updated.push({ ...row, status: 'エラー', errorReason: '新しい名前が空です' })
        continue
      }
      if (row.afterName.length > 64) {
        updated.push({ ...row, status: 'エラー', errorReason: '名前は64文字以内にしてください' })
        continue
      }
      try {
        await updateTeam({
          variables: { id: row.id, input: { name: row.afterName } },
          refetchQueries: ['GetAdminTeams'],
        })
        updated.push({ ...row, status: '成功' })
      } catch {
        updated.push({ ...row, status: 'エラー', errorReason: 'APIエラー' })
      }
    }

    setRows(updated)
    setExecuted(true)
  }

  const handleReset = () => {
    setCsvText('')
    setRows([])
    setExecuted(false)
  }

  return { csvText, handleCsvChange, rows, handleExecute, handleReset, executed }
}
