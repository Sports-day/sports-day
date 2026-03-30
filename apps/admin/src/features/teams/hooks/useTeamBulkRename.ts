import { useState } from 'react'
import { MOCK_TEAMS, persistTeams } from '../mock'

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

  const handleCsvChange = (value: string) => {
    setCsvText(value)
    setExecuted(false)

    const parsed: BulkRenameRow[] = value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // 最初のカンマのみで分割（チーム名にカンマが含まれる場合を考慮）
        const commaIndex = line.indexOf(',')
        const id = commaIndex !== -1 ? line.slice(0, commaIndex).trim() : line.trim()
        const afterName = commaIndex !== -1 ? line.slice(commaIndex + 1).trim() : ''
        const team = MOCK_TEAMS.find((t) => t.id === id)
        return {
          id: id ?? '',
          beforeName: team?.name ?? '(不明)',
          afterName: afterName ?? '',
          status: '待機中' as const,
        }
      })

    setRows(parsed)
  }

  const handleExecute = () => {
    const updated = rows.map((row) => {
      const team = MOCK_TEAMS.find((t) => t.id === row.id)
      if (!team) return { ...row, status: 'エラー' as const, errorReason: 'IDが見つかりません' }
      if (!row.afterName) return { ...row, status: 'エラー' as const, errorReason: '新しい名前が空です' }
      team.name = row.afterName
      return { ...row, status: '成功' as const }
    })
    setRows(updated)
    setExecuted(true)
    persistTeams()
  }

  const handleReset = () => {
    setCsvText('')
    setRows([])
    setExecuted(false)
  }

  return { csvText, handleCsvChange, rows, handleExecute, handleReset, executed }
}
