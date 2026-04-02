import { useGetAdminTournamentQuery } from '@/gql/__generated__/graphql'
import type { MockTournamentDetailData } from '../types'

export function useTournamentDetail(tournamentId: string, tournamentName: string): MockTournamentDetailData {
  // 【未確定】 GraphQL Tournament → MockTournamentDetailData への完全マッピングは後続タスク
  const { data } = useGetAdminTournamentQuery({
    variables: { id: tournamentId },
    skip: !tournamentId,
  })

  if (!data?.tournament) {
    return {
      id: tournamentId,
      name: tournamentName,
      description: '',
      teamCount: 0,
      placementMethod: 'SEED_OPTIMIZED',
      tag: '',
      brackets: [],
    }
  }

  const t = data.tournament
  return {
    id: t.id,
    name: t.name,
    description: '',
    teamCount: t.slots.length,
    placementMethod: (t.placementMethod ?? 'SEED_OPTIMIZED') as MockTournamentDetailData['placementMethod'],
    tag: '',
    brackets: [],  // 【未確定】 GraphQL TournamentSlot → MockBracket へのマッピングは後続タスク
  }
}
