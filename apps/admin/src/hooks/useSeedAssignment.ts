import { useMemo, useState } from 'react'
import {
  useAssignAdminSeedTeamMutation,
  useUpdateAdminSeedNumbersMutation,
  useGetAdminTournamentQuery,
} from '@/gql/__generated__/graphql'

export function useSeedAssignment(tournamentId: string) {
  const { data } = useGetAdminTournamentQuery({ variables: { id: tournamentId } })

  const slots = data?.tournament?.slots ?? []

  // seedNumber != null のスロット（ソート済み）
  const seedSlots = useMemo(
    () =>
      slots
        .filter((s): s is typeof s & { seedNumber: number } => s.seedNumber != null)
        .sort((a, b) => a.seedNumber - b.seedNumber),
    [slots],
  )

  const seedNumbers: number[] = useMemo(() => seedSlots.map((s) => s.seedNumber), [seedSlots])

  // seedNumber → slotId マップ
  const seedToSlotId = useMemo<Record<number, string>>(
    () => Object.fromEntries(seedSlots.map((s) => [s.seedNumber, s.id])),
    [seedSlots],
  )

  // 既存の割り当てから初期値を構築
  const initialAssignments = useMemo<Record<number, string>>(() => {
    const result: Record<number, string> = {}
    for (const s of seedSlots) {
      const teamId = s.matchEntry?.team?.id
      if (teamId) {
        result[s.seedNumber] = teamId
      }
    }
    return result
  }, [seedSlots])

  const [assignments, setAssignments] = useState<Record<number, string>>({})

  // サーバーから取得した初期値と local state をマージ（サーバー値を base に）
  const mergedAssignments: Record<number, string> = useMemo(
    () => ({ ...initialAssignments, ...assignments }),
    [initialAssignments, assignments],
  )

  // トーナメントに参加しているチーム一覧（slots の matchEntry.team から重複除去）
  const teams: { id: string; name: string }[] = useMemo(() => {
    const seen = new Set<string>()
    const result: { id: string; name: string }[] = []
    for (const s of slots) {
      const team = s.matchEntry?.team
      if (team && !seen.has(team.id)) {
        seen.add(team.id)
        result.push({ id: team.id, name: team.name })
      }
    }
    return result
  }, [slots])

  const [assignSeedTeam] = useAssignAdminSeedTeamMutation({
    refetchQueries: ['GetAdminTournament'],
  })
  const [updateSeedNumbers] = useUpdateAdminSeedNumbersMutation({
    refetchQueries: ['GetAdminTournament'],
  })

  const setAssignment = (seedNumber: number, teamId: string) => {
    setAssignments((prev) => ({ ...prev, [seedNumber]: teamId }))
  }

  const saveAssignments = async () => {
    const promises = Object.entries(mergedAssignments).map(([seedNumberStr, teamId]) => {
      const seedNumber = Number(seedNumberStr)
      const slotId = seedToSlotId[seedNumber]
      if (!slotId) return Promise.resolve()
      return assignSeedTeam({
        variables: {
          input: {
            slotId,
            teamId: teamId || null,
          },
        },
      })
    })
    await Promise.all(promises)
    setAssignments({})
  }

  /**
   * シード番号の順序を入れ替える
   * @param reorderedSeeds - 新しい順序の { slotId, seedNumber } 配列
   */
  const reorderSeeds = async (reorderedSeeds: { slotId: string; seedNumber: number }[]) => {
    await updateSeedNumbers({
      variables: {
        tournamentId,
        seeds: reorderedSeeds.map((s) => ({
          slotId: s.slotId,
          seedNumber: s.seedNumber,
        })),
      },
    })
    setAssignments({})
  }

  /**
   * 2つのシード番号を交換する
   */
  const swapSeeds = async (seedA: number, seedB: number) => {
    const slotIdA = seedToSlotId[seedA]
    const slotIdB = seedToSlotId[seedB]
    if (!slotIdA || !slotIdB) return

    await updateSeedNumbers({
      variables: {
        tournamentId,
        seeds: [
          { slotId: slotIdA, seedNumber: seedB },
          { slotId: slotIdB, seedNumber: seedA },
        ],
      },
    })
    setAssignments({})
  }

  return {
    seedNumbers,
    assignments: mergedAssignments,
    teams,
    seedSlots,
    seedToSlotId,
    version: seedSlots.length,
    setAssignment,
    saveAssignments,
    reorderSeeds,
    swapSeeds,
  }
}
