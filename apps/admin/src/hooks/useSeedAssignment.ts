import { useMemo, useState } from 'react'
import {
  useAssignAdminSeedTeamMutation,
  useUpdateAdminSeedNumbersMutation,
  useGetAdminTournamentQuery,
} from '@/gql/__generated__/graphql'

export function useSeedAssignment(tournamentId: string) {
  const { data } = useGetAdminTournamentQuery({
    variables: { id: tournamentId },
    skip: !tournamentId,
  })

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

  // コンペティションのエントリー全員をシード選択候補として使う
  const teams: { id: string; name: string }[] = useMemo(
    () => data?.tournament?.competition?.teams ?? [],
    [data],
  )

  const [assignSeedTeam] = useAssignAdminSeedTeamMutation({
    refetchQueries: ['GetAdminTournament'],
  })
  const [updateSeedNumbers] = useUpdateAdminSeedNumbersMutation({
    refetchQueries: ['GetAdminTournament'],
  })

  const setAssignment = (seedNumber: number, teamId: string) => {
    setAssignments((prev) => ({ ...prev, [seedNumber]: teamId }))
  }

  /** slotId を直接指定してチームを割り当てる（タイミング問題なし） */
  const assignSlotDirectly = async (slotId: string, teamId: string | null) => {
    await assignSeedTeam({
      variables: { input: { slotId, teamId: teamId || null } },
    })
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
   * スロット ID と seed 番号を直接指定してシードを交換する。
   * ブラケットをまたいだ操作でも正しい tournamentId を使える。
   */
  const swapSeedsFromSlots = async (
    slotIdA: string,
    seedA: number,
    slotIdB: string,
    seedB: number,
    tid: string,
  ) => {
    await updateSeedNumbers({
      variables: {
        tournamentId: tid,
        seeds: [
          { slotId: slotIdA, seedNumber: seedB },
          { slotId: slotIdB, seedNumber: seedA },
        ],
      },
    })
    setAssignments({})
  }

  /**
   * 2つの試合のシードを一度にアトミックに入れ替える。
   * 4スロットを1回のミューテーションで更新することで競合を防ぐ。
   * スロットIDまたはシード番号が欠損している場合は false を返す。
   */
  const swapMatchSeeds = async (
    matchA: { slot1: { slotId?: string; seedNumber?: number }; slot2: { slotId?: string; seedNumber?: number } },
    matchB: { slot1: { slotId?: string; seedNumber?: number }; slot2: { slotId?: string; seedNumber?: number } },
    tid: string,
  ): Promise<boolean> => {
    const { slotId: idA1, seedNumber: sA1 } = matchA.slot1
    const { slotId: idA2, seedNumber: sA2 } = matchA.slot2
    const { slotId: idB1, seedNumber: sB1 } = matchB.slot1
    const { slotId: idB2, seedNumber: sB2 } = matchB.slot2
    if (!idA1 || !idA2 || !idB1 || !idB2 || sA1 == null || sA2 == null || sB1 == null || sB2 == null) return false
    await updateSeedNumbers({
      variables: {
        tournamentId: tid,
        seeds: [
          { slotId: idA1, seedNumber: sB1 },
          { slotId: idA2, seedNumber: sB2 },
          { slotId: idB1, seedNumber: sA1 },
          { slotId: idB2, seedNumber: sA2 },
        ],
      },
    })
    setAssignments({})
    return true
  }

  /**
   * シード番号の順序を入れ替える
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

  return {
    seedNumbers,
    assignments: mergedAssignments,
    teams,
    seedSlots,
    seedToSlotId,
    version: seedSlots.length,
    setAssignment,
    saveAssignments,
    assignSlotDirectly,
    swapSeedsFromSlots,
    swapMatchSeeds,
    reorderSeeds,
  }
}
