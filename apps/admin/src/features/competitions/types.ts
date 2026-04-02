export type Competition = {
  id: string
  name: string
  description: string
  icon: string
  tag: string
}

// ─── Tournament bracket types (GraphQL 未実装 【未確定】) ───

export type MockTSlot = {
  sourceType: 'SEED' | 'MATCH_WINNER' | 'MATCH_LOSER'
  sourceMatchId?: string
  seedNumber?: number
  teamId?: string | null
  teamName?: string | null
}

export type MockTMatch = {
  id: string
  label?: string
  round: number
  slot1: MockTSlot
  slot2: MockTSlot
  score1?: number | null
  score2?: number | null
  winnerTeamId?: string | null
  status: 'STANDBY' | 'ONGOING' | 'FINISHED'
}

export type MockBracket = {
  id: string
  name: string
  bracketType: 'MAIN' | 'SUB'
  displayOrder: number
  matches: MockTMatch[]
}

export type MockTournamentDetailData = {
  id: string
  name: string
  description: string
  teamCount: number
  placementMethod: 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'
  tag: string
  brackets: MockBracket[]
}
