export type Competition = {
  id: string
  name: string
  type: string
  sceneId: string
  sceneName: string
  sportId: string
  sportName: string
}

// ─── Tournament bracket types ───

export type TournamentSlotView = {
  slotId?: string
  sourceType: 'SEED' | 'MATCH_WINNER' | 'MATCH_LOSER'
  sourceMatchId?: string
  seedNumber?: number
  teamId?: string | null
  teamName?: string | null
}

export type TournamentMatchView = {
  id: string
  label?: string
  round: number
  slot1: TournamentSlotView
  slot2: TournamentSlotView
  score1?: number | null
  score2?: number | null
  winnerTeamId?: string | null
  status: 'STANDBY' | 'ONGOING' | 'FINISHED'
  time?: string
}

export type BracketView = {
  id: string
  name: string
  bracketType: 'MAIN' | 'SUB'
  displayOrder: number
  matches: TournamentMatchView[]
}

export type TournamentDetailView = {
  id: string
  name: string
  description: string
  teamCount: number
  placementMethod: 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'
  tag: string
  sportId: string
  sceneId: string
  brackets: BracketView[]
}

// ─── Progression rule types (shared between league & tournament) ───

export type ProgressionRule = {
  rank: number
  targetId: string
}

export type ProgressionTarget = {
  id: string
  name: string
  type: 'league' | 'tournament'
}
