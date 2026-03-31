import { MOCK_TOURNAMENT_DETAILS } from '../mock'
import type { MockTournamentDetailData } from '../mock'

export function useTournamentDetail(tournamentId: string, tournamentName: string): MockTournamentDetailData {
  return (
    MOCK_TOURNAMENT_DETAILS[tournamentId] ?? {
      id: tournamentId,
      name: tournamentName,
      description: '',
      teamCount: 0,
      placementMethod: 'SEED_OPTIMIZED' as const,
      tag: '',
      brackets: [],
    }
  )
}
