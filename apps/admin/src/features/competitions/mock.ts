import type { Competition } from './types'

export const MOCK_COMPETITIONS: Competition[] = [
  { id: '1', name: 'バスケットボール晴天時' },
  { id: '2', name: 'バスケットボール雨天時' },
  { id: '3', name: 'ビーチボール晴天時' },
  { id: '4', name: 'ビーチボール雨天時' },
]

export type MockLeague = { id: string; name: string }

export const MOCK_LEAGUES_BY_COMPETITION: Record<string, MockLeague[]> = {
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
}

export type MockLeagueEntry = { id: number; teamName: string; teamClass: string }

export type MockLeagueDetail = {
  name: string
  description: string
  weight: string
  matchFormat: string
  resultJudgment: string
  tag: string
  entries?: MockLeagueEntry[]
}

export const MOCK_LEAGUE_DETAILS: Record<string, MockLeagueDetail> = {
  '1': { name: '晴天時 LEAGUE 1', description: '晴天時 Game', weight: '0', matchFormat: 'sunny', resultJudgment: 'score', tag: 'sunny' },
  '2': { name: '晴天時 LEAGUE 2', description: '晴天時 Game', weight: '0', matchFormat: 'sunny', resultJudgment: 'score', tag: 'sunny' },
  '3': { name: '雨天時 LEAGUE 1', description: '雨天時 Game', weight: '0', matchFormat: 'rainy', resultJudgment: 'score', tag: 'rainy' },
  '4': { name: '晴天時 LEAGUE 1', description: '晴天時 Game', weight: '0', matchFormat: 'sunny', resultJudgment: 'score', tag: 'sunny' },
  '5': { name: '雨天時 LEAGUE 1', description: '雨天時 Game', weight: '0', matchFormat: 'rainy', resultJudgment: 'score', tag: 'rainy' },
}
