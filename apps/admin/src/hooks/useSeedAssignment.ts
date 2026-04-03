import { useState } from 'react'

// 【未確定】トーナメントブラケットデータは GraphQL API 未実装。シード割り当ては後続タスクで対応。
export function useSeedAssignment(_tournamentId: string) {
  const [assignments, setAssignments] = useState<Record<number, string>>({})

  const setAssignment = (seedNumber: number, teamId: string) => {
    setAssignments(prev => ({ ...prev, [seedNumber]: teamId }))
  }

  const saveAssignments = () => {
    // 【未確定】GraphQL API 未実装
  }

  return {
    seedNumbers: [] as number[],
    assignments,
    teams: [] as { id: string; name: string }[],
    version: 0,
    setAssignment,
    saveAssignments,
  }
}
