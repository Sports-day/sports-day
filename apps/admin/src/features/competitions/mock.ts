import type { Competition } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_COMPETITIONS: Competition[] = loadFromStorage('admin_competitions', [
  { id: '1', name: 'バスケットボール晴天時' },
  { id: '2', name: 'バスケットボール雨天時' },
  { id: '3', name: 'ビーチボール晴天時' },
  { id: '4', name: 'ビーチボール雨天時' },
])

export type MockLeague = { id: string; name: string }
export type MockTournament = { id: string; name: string }

export const MOCK_LEAGUES_BY_COMPETITION: Record<string, MockLeague[]> = loadFromStorage('admin_leagues_by_competition', {
  '1': [
    { id: '1', name: '晴天時 LEAGUE 1' },
    { id: '2', name: '晴天時 LEAGUE 2' },
  ],
  '2': [
    { id: '3', name: '雨天時 LEAGUE 1' },
  ],
  '3': [
    { id: '4', name: '晴天時 LEAGUE 1' },
  ],
  '4': [
    { id: '5', name: '雨天時 LEAGUE 1' },
  ],
})

export const MOCK_TOURNAMENTS_BY_COMPETITION: Record<string, MockTournament[]> = loadFromStorage('admin_tournaments_by_competition', {
  '1': [{ id: 't1', name: '晴天時 決勝トーナメント' }],
  '2': [],
  '3': [{ id: 't2', name: '晴天時 決勝トーナメント' }],
  '4': [],
})

export type MockLeagueEntry = { id: number; teamName: string; teamClass: string }

export type MockLeagueDetail = {
  name: string
  description: string
  weight: string
  matchFormat: string
  resultJudgments: string[]
  tag: string
  entries?: MockLeagueEntry[]
  progressionEnabled?: boolean
  progressionMaxRank?: number
  progressionRules?: Array<{ rank: number; targetId: string }>
}

export const MOCK_LEAGUE_DETAILS: Record<string, MockLeagueDetail> = loadFromStorage('admin_league_details', {
  '1': { name: '晴天時 LEAGUE 1', description: '晴天時 Game', weight: '0', matchFormat: 'sunny', resultJudgments: ['score'], tag: 'sunny' },
  '2': { name: '晴天時 LEAGUE 2', description: '晴天時 Game', weight: '0', matchFormat: 'sunny', resultJudgments: ['score'], tag: 'sunny' },
  '3': { name: '雨天時 LEAGUE 1', description: '雨天時 Game', weight: '0', matchFormat: 'rainy', resultJudgments: ['score'], tag: 'rainy' },
  '4': { name: '晴天時 LEAGUE 1', description: '晴天時 Game', weight: '0', matchFormat: 'sunny', resultJudgments: ['score'], tag: 'sunny' },
  '5': { name: '雨天時 LEAGUE 1', description: '雨天時 Game', weight: '0', matchFormat: 'rainy', resultJudgments: ['score'], tag: 'rainy' },
})

// ─────────────────────────────────────────────────────────
// Tournament Detail Types
// ─────────────────────────────────────────────────────────

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
  round: number // 0 = 最初のラウンド、数が大きいほど後のラウンド
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
  hasThirdPlace: boolean
  hasFifthPlace: boolean
  placementMethod: 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'
  tag: string
  brackets: MockBracket[]
}

// ─────────────────────────────────────────────────────────
// Tournament Detail Mock Data
// ─────────────────────────────────────────────────────────

// t1: 4チーム + 3位決定戦（バスケ晴天時）
// MAIN: 準決勝 × 2 → 決勝
// SUB: 3位決定戦 × 1
const TOURNAMENT_T1_DEFAULT: MockTournamentDetailData = {
  id: 't1',
  name: '晴天時 決勝トーナメント',
  description: '',
  teamCount: 4,
  hasThirdPlace: true,
  hasFifthPlace: false,
  placementMethod: 'SEED_OPTIMIZED',
  tag: 'sunny',
  brackets: [
    {
      id: 'tb_main_1',
      name: 'メインブラケット',
      bracketType: 'MAIN',
      displayOrder: 1,
      matches: [
        {
          id: 'm_sf1',
          label: '準決勝①',
          round: 0,
          slot1: { sourceType: 'SEED', seedNumber: 1, teamId: null, teamName: null },
          slot2: { sourceType: 'SEED', seedNumber: 4, teamId: null, teamName: null },
          score1: null,
          score2: null,
          winnerTeamId: null,
          status: 'STANDBY',
        },
        {
          id: 'm_sf2',
          label: '準決勝②',
          round: 0,
          slot1: { sourceType: 'SEED', seedNumber: 2, teamId: null, teamName: null },
          slot2: { sourceType: 'SEED', seedNumber: 3, teamId: null, teamName: null },
          score1: null,
          score2: null,
          winnerTeamId: null,
          status: 'STANDBY',
        },
        {
          id: 'm_final',
          label: '決勝',
          round: 1,
          slot1: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm_sf1', teamId: null, teamName: null },
          slot2: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm_sf2', teamId: null, teamName: null },
          score1: null,
          score2: null,
          winnerTeamId: null,
          status: 'STANDBY',
        },
      ],
    },
    {
      id: 'tb_sub_1',
      name: '3位決定戦',
      bracketType: 'SUB',
      displayOrder: 2,
      matches: [
        {
          id: 'm_3rd',
          label: '3位決定戦',
          round: 0,
          slot1: { sourceType: 'MATCH_LOSER', sourceMatchId: 'm_sf1', teamId: null, teamName: null },
          slot2: { sourceType: 'MATCH_LOSER', sourceMatchId: 'm_sf2', teamId: null, teamName: null },
          score1: null,
          score2: null,
          winnerTeamId: null,
          status: 'STANDBY',
        },
      ],
    },
  ],
}

// t2: 8チーム シングルエリミネーション（ビーチボール晴天時）
// MAIN: 準々決勝 × 4 → 準決勝 × 2 → 決勝
const TOURNAMENT_T2_DEFAULT: MockTournamentDetailData = {
  id: 't2',
  name: '晴天時 決勝トーナメント',
  description: '',
  teamCount: 8,
  hasThirdPlace: false,
  hasFifthPlace: false,
  placementMethod: 'SEED_OPTIMIZED',
  tag: 'sunny',
  brackets: [
    {
      id: 'tb_main_2',
      name: 'メインブラケット',
      bracketType: 'MAIN',
      displayOrder: 1,
      matches: [
        // Round 0: 準々決勝
        {
          id: 'm2_qf1',
          label: '準々決勝①',
          round: 0,
          slot1: { sourceType: 'SEED', seedNumber: 1, teamId: 'team-e1', teamName: '1年Aチーム' },
          slot2: { sourceType: 'SEED', seedNumber: 8, teamId: 'team-e2', teamName: '3年Bチーム' },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
        {
          id: 'm2_qf2',
          label: '準々決勝②',
          round: 0,
          slot1: { sourceType: 'SEED', seedNumber: 4, teamId: 'team-e3', teamName: '2年Aチーム' },
          slot2: { sourceType: 'SEED', seedNumber: 5, teamId: 'team-e4', teamName: '1年Bチーム' },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
        {
          id: 'm2_qf3',
          label: '準々決勝③',
          round: 0,
          slot1: { sourceType: 'SEED', seedNumber: 2, teamId: 'team-e5', teamName: '3年Aチーム' },
          slot2: { sourceType: 'SEED', seedNumber: 7, teamId: 'team-e6', teamName: '2年Cチーム' },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
        {
          id: 'm2_qf4',
          label: '準々決勝④',
          round: 0,
          slot1: { sourceType: 'SEED', seedNumber: 3, teamId: 'team-e7', teamName: '1年Cチーム' },
          slot2: { sourceType: 'SEED', seedNumber: 6, teamId: 'team-e8', teamName: '2年Bチーム' },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
        // Round 1: 準決勝
        {
          id: 'm2_sf1',
          label: '準決勝①',
          round: 1,
          slot1: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm2_qf1', teamId: null, teamName: null },
          slot2: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm2_qf2', teamId: null, teamName: null },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
        {
          id: 'm2_sf2',
          label: '準決勝②',
          round: 1,
          slot1: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm2_qf3', teamId: null, teamName: null },
          slot2: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm2_qf4', teamId: null, teamName: null },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
        // Round 2: 決勝
        {
          id: 'm2_final',
          label: '決勝',
          round: 2,
          slot1: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm2_sf1', teamId: null, teamName: null },
          slot2: { sourceType: 'MATCH_WINNER', sourceMatchId: 'm2_sf2', teamId: null, teamName: null },
          score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
        },
      ],
    },
  ],
}

export const MOCK_TOURNAMENT_DETAILS: Record<string, MockTournamentDetailData> = loadFromStorage('admin_tournament_details', {
  t1: TOURNAMENT_T1_DEFAULT,
  t2: TOURNAMENT_T2_DEFAULT,
})

export function persistCompetitionsData() {
  saveToStorage('admin_competitions', MOCK_COMPETITIONS)
  saveToStorage('admin_leagues_by_competition', MOCK_LEAGUES_BY_COMPETITION)
  saveToStorage('admin_tournaments_by_competition', MOCK_TOURNAMENTS_BY_COMPETITION)
  saveToStorage('admin_league_details', MOCK_LEAGUE_DETAILS)
  saveToStorage('admin_tournament_details', MOCK_TOURNAMENT_DETAILS)
}
