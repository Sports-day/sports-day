import { useState } from 'react'
import {
  useGetAdminPromotionRulesLazyQuery,
  useGetAdminLeagueStandingsLazyQuery,
  useAddAdminCompetitionEntriesMutation,
} from '@/gql/__generated__/graphql'

export function useExecuteProgression() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [fetchPromotionRules] = useGetAdminPromotionRulesLazyQuery()
  const [fetchStandings] = useGetAdminLeagueStandingsLazyQuery()
  const [addCompetitionEntries] = useAddAdminCompetitionEntriesMutation()

  const execute = async (competitionId: string, leagueId: string): Promise<number> => {
    setLoading(true)
    setError(null)

    try {
      // 1. 進出ルールを取得
      const { data: rulesData } = await fetchPromotionRules({
        variables: { sourceCompetitionId: competitionId },
      })
      const rules = rulesData?.promotionRules ?? []
      if (rules.length === 0) return 0

      // 2. 順位表を取得
      const { data: standingsData } = await fetchStandings({
        variables: { leagueId },
      })
      const standings = standingsData?.leagueStandings ?? []
      if (standings.length === 0) return 0

      // 3. rankSpec → チームIDのマップを構築
      const rankToTeamId = new Map<number, string>()
      for (const standing of standings) {
        rankToTeamId.set(standing.rank, standing.team.id)
      }

      // 4. ルールごとにターゲット大会にエントリー
      // ターゲット大会ごとにチームIDをまとめる
      const targetEntries = new Map<string, string[]>()
      for (const rule of rules) {
        const rank = parseInt(rule.rankSpec)
        const teamId = rankToTeamId.get(rank)
        if (!teamId) continue

        const targetId = rule.targetCompetition.id
        const existing = targetEntries.get(targetId) ?? []
        existing.push(teamId)
        targetEntries.set(targetId, existing)
      }

      let totalCount = 0
      for (const [targetId, teamIds] of targetEntries) {
        await addCompetitionEntries({
          variables: {
            id: targetId,
            input: { teamIds },
          },
        })
        totalCount += teamIds.length
      }

      return totalCount
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      setError(err)
      return 0
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading, error }
}
