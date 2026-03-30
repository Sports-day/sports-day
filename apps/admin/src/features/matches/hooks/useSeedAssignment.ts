import { useState } from 'react'
import { MOCK_TOURNAMENT_DETAILS, persistCompetitionsData } from '@/features/competitions/mock'
import { MOCK_TEAMS } from '@/features/teams/mock'

export function useSeedAssignment(tournamentId: string) {
  const data = MOCK_TOURNAMENT_DETAILS[tournamentId]

  // Collect all unique seed numbers with current assignments
  const seedMap = new Map<number, { teamId: string | null; teamName: string | null }>()
  if (data) {
    for (const bracket of data.brackets) {
      for (const match of bracket.matches) {
        for (const slot of [match.slot1, match.slot2]) {
          if (slot.sourceType === 'SEED' && slot.seedNumber != null && !seedMap.has(slot.seedNumber)) {
            seedMap.set(slot.seedNumber, {
              teamId: slot.teamId ?? null,
              teamName: slot.teamName ?? null,
            })
          }
        }
      }
    }
  }

  const seedNumbers = Array.from(seedMap.keys()).sort((a, b) => a - b)

  const [assignments, setAssignments] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {}
    for (const [seedNumber, slot] of seedMap.entries()) {
      if (slot.teamId) init[seedNumber] = slot.teamId
    }
    return init
  })

  // version bumps on save to trigger re-render in parent
  const [version, setVersion] = useState(0)

  const setAssignment = (seedNumber: number, teamId: string) => {
    setAssignments((prev) => ({ ...prev, [seedNumber]: teamId }))
  }

  const saveAssignments = () => {
    if (!data) return
    for (const bracket of data.brackets) {
      for (const match of bracket.matches) {
        for (const slot of [match.slot1, match.slot2]) {
          if (slot.sourceType === 'SEED' && slot.seedNumber != null) {
            const teamId = assignments[slot.seedNumber] ?? null
            if (teamId) {
              const team = MOCK_TEAMS.find((t) => t.id === teamId)
              slot.teamId = teamId
              slot.teamName = team?.name ?? null
            } else {
              slot.teamId = null
              slot.teamName = null
            }
          }
        }
      }
    }
    persistCompetitionsData()
    setVersion((v) => v + 1)
  }

  return {
    seedNumbers,
    assignments,
    teams: MOCK_TEAMS,
    version,
    setAssignment,
    saveAssignments,
  }
}
