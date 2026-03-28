import { useState } from 'react'
import { MOCK_TEAMS } from '../mock'

export type BulkRenameRow = {
  id: string
  beforeName: string
  afterName: string
  status: '待機中' | '成功' | 'エラー'
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
        const [id, afterName] = line.split(',').map((s) => s.trim())
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
      if (!team || !row.afterName) {
        return { ...row, status: 'エラー' as const }
      }
      team.name = row.afterName
      return { ...row, status: '成功' as const }
    })
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
