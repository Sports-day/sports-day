import { useState } from 'react'
import { useGetAdminTeamsQuery } from '@/gql/__generated__/graphql'

export function useTeamExport() {
  const [selectedTag, setSelectedTag] = useState('')
  const { data } = useGetAdminTeamsQuery()
  const teams = data?.teams ?? []

  // 【未確定】 GraphQL Team に tags フィールドなし。group.name でフィルタリング
  const allTags = Array.from(new Set(teams.map(t => t.group.name))).filter(Boolean)

  const handleExport = () => {
    const filtered = selectedTag
      ? teams.filter((t) => t.group.name === selectedTag)
      : teams
    const header = 'ID,チーム名,クラス\n'
    const escape = (s: string) => `"${s.replace(/"/g, '""')}"`
    const rows = filtered
      .map((t) => `${escape(String(t.id))},${escape(t.name)},${escape(t.group.name)}`)
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
