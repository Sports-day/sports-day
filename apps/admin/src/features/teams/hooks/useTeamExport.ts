import { useState } from 'react'
import { MOCK_TEAMS } from '../mock'

export function useTeamExport() {
  const [selectedTag, setSelectedTag] = useState('')

  const allTags = Array.from(new Set(MOCK_TEAMS.flatMap((t) => t.tags)))

  const handleExport = () => {
    const filtered = selectedTag
      ? MOCK_TEAMS.filter((t) => t.tags.includes(selectedTag))
      : MOCK_TEAMS
    const header = 'ID,チーム名,クラス,タグ\n'
    const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = filtered
      .map((t) => `${escape(String(t.id))},${escape(t.name)},${escape(t.class)},${escape(t.tags.join('/'))}`)
      .join('\n')
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedTag ? `teams_${selectedTag}.csv` : 'teams.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return { selectedTag, setSelectedTag, allTags, handleExport }
}
