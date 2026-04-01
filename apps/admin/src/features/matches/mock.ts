import type { ActiveLeague } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

const DEFAULT_ACTIVE_LEAGUES: Record<string, ActiveLeague[]> = {
  '1': [
    {
      id: '1',
      name: '晴天時 LEAGUE 1',
      teams: [
        { id: 't1-1', name: 'TEAM LEAGUE 1-1', shortName: 'Team A-1' },
        { id: 't1-2', name: 'TEAM LEAGUE 1-2', shortName: 'Team A-2' },
        { id: 't1-3', name: 'TEAM LEAGUE 1-3', shortName: 'Team A-3' },
        { id: 't1-4', name: 'TEAM LEAGUE 1-4', shortName: 'Team A-4' },
      ],
      matches: [
        { id: 'm1-1', teamAId: 't1-1', teamBId: 't1-2', scoreA: 0, scoreB: 0, status: 'standby', time: '20時25分' },
        { id: 'm1-2', teamAId: 't1-1', teamBId: 't1-3', scoreA: 0, scoreB: 0, status: 'standby', time: '20時50分' },
        { id: 'm1-3', teamAId: 't1-1', teamBId: 't1-4', scoreA: 0, scoreB: 0, status: 'standby', time: '21時15分' },
        { id: 'm1-4', teamAId: 't1-2', teamBId: 't1-3', scoreA: 0, scoreB: 0, status: 'standby', time: '21時40分' },
        { id: 'm1-5', teamAId: 't1-2', teamBId: 't1-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時05分' },
        { id: 'm1-6', teamAId: 't1-3', teamBId: 't1-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時30分' },
      ],
    },
    {
      id: '2',
      name: '晴天時 LEAGUE 2',
      teams: [
        { id: 't2-1', name: 'TEAM LEAGUE 2-1', shortName: 'Team B-1' },
        { id: 't2-2', name: 'TEAM LEAGUE 2-2', shortName: 'Team B-2' },
        { id: 't2-3', name: 'TEAM LEAGUE 2-3', shortName: 'Team B-3' },
        { id: 't2-4', name: 'TEAM LEAGUE 2-4', shortName: 'Team B-4' },
      ],
      matches: [
        { id: 'm2-1', teamAId: 't2-1', teamBId: 't2-2', scoreA: 0, scoreB: 0, status: 'standby', time: '20時25分' },
        { id: 'm2-2', teamAId: 't2-1', teamBId: 't2-3', scoreA: 0, scoreB: 0, status: 'standby', time: '20時50分' },
        { id: 'm2-3', teamAId: 't2-1', teamBId: 't2-4', scoreA: 0, scoreB: 0, status: 'standby', time: '21時15分' },
        { id: 'm2-4', teamAId: 't2-2', teamBId: 't2-3', scoreA: 0, scoreB: 0, status: 'standby', time: '21時40分' },
        { id: 'm2-5', teamAId: 't2-2', teamBId: 't2-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時05分' },
        { id: 'm2-6', teamAId: 't2-3', teamBId: 't2-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時30分' },
      ],
    },
  ],
  '2': [
    {
      id: '3',
      name: '雨天時 LEAGUE 1',
      teams: [
        { id: 't3-1', name: 'TEAM LEAGUE 1-1', shortName: 'Team A-1' },
        { id: 't3-2', name: 'TEAM LEAGUE 1-2', shortName: 'Team A-2' },
        { id: 't3-3', name: 'TEAM LEAGUE 1-3', shortName: 'Team A-3' },
        { id: 't3-4', name: 'TEAM LEAGUE 1-4', shortName: 'Team A-4' },
      ],
      matches: [
        { id: 'm3-1', teamAId: 't3-1', teamBId: 't3-2', scoreA: 0, scoreB: 0, status: 'standby', time: '20時25分' },
        { id: 'm3-2', teamAId: 't3-1', teamBId: 't3-3', scoreA: 0, scoreB: 0, status: 'standby', time: '20時50分' },
        { id: 'm3-3', teamAId: 't3-1', teamBId: 't3-4', scoreA: 0, scoreB: 0, status: 'standby', time: '21時15分' },
        { id: 'm3-4', teamAId: 't3-2', teamBId: 't3-3', scoreA: 0, scoreB: 0, status: 'standby', time: '21時40分' },
        { id: 'm3-5', teamAId: 't3-2', teamBId: 't3-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時05分' },
        { id: 'm3-6', teamAId: 't3-3', teamBId: 't3-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時30分' },
      ],
    },
  ],
  '3': [
    {
      id: '4',
      name: '晴天時 LEAGUE 1',
      teams: [
        { id: 't4-1', name: 'TEAM LEAGUE 1-1', shortName: 'Team A-1' },
        { id: 't4-2', name: 'TEAM LEAGUE 1-2', shortName: 'Team A-2' },
        { id: 't4-3', name: 'TEAM LEAGUE 1-3', shortName: 'Team A-3' },
        { id: 't4-4', name: 'TEAM LEAGUE 1-4', shortName: 'Team A-4' },
      ],
      matches: [
        { id: 'm4-1', teamAId: 't4-1', teamBId: 't4-2', scoreA: 0, scoreB: 0, status: 'standby', time: '20時25分' },
        { id: 'm4-2', teamAId: 't4-1', teamBId: 't4-3', scoreA: 0, scoreB: 0, status: 'standby', time: '20時50分' },
        { id: 'm4-3', teamAId: 't4-1', teamBId: 't4-4', scoreA: 0, scoreB: 0, status: 'standby', time: '21時15分' },
        { id: 'm4-4', teamAId: 't4-2', teamBId: 't4-3', scoreA: 0, scoreB: 0, status: 'standby', time: '21時40分' },
        { id: 'm4-5', teamAId: 't4-2', teamBId: 't4-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時05分' },
        { id: 'm4-6', teamAId: 't4-3', teamBId: 't4-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時30分' },
      ],
    },
  ],
  '4': [
    {
      id: '5',
      name: '雨天時 LEAGUE 1',
      teams: [
        { id: 't5-1', name: 'TEAM LEAGUE 1-1', shortName: 'Team A-1' },
        { id: 't5-2', name: 'TEAM LEAGUE 1-2', shortName: 'Team A-2' },
        { id: 't5-3', name: 'TEAM LEAGUE 1-3', shortName: 'Team A-3' },
        { id: 't5-4', name: 'TEAM LEAGUE 1-4', shortName: 'Team A-4' },
      ],
      matches: [
        { id: 'm5-1', teamAId: 't5-1', teamBId: 't5-2', scoreA: 0, scoreB: 0, status: 'standby', time: '20時25分' },
        { id: 'm5-2', teamAId: 't5-1', teamBId: 't5-3', scoreA: 0, scoreB: 0, status: 'standby', time: '20時50分' },
        { id: 'm5-3', teamAId: 't5-1', teamBId: 't5-4', scoreA: 0, scoreB: 0, status: 'standby', time: '21時15分' },
        { id: 'm5-4', teamAId: 't5-2', teamBId: 't5-3', scoreA: 0, scoreB: 0, status: 'standby', time: '21時40分' },
        { id: 'm5-5', teamAId: 't5-2', teamBId: 't5-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時05分' },
        { id: 'm5-6', teamAId: 't5-3', teamBId: 't5-4', scoreA: 0, scoreB: 0, status: 'standby', time: '22時30分' },
      ],
    },
  ],
}

export const MOCK_ACTIVE_LEAGUES: Record<string, ActiveLeague[]> = loadFromStorage('admin_active_leagues', DEFAULT_ACTIVE_LEAGUES)

export function persistActiveLeagues() {
  saveToStorage('admin_active_leagues', MOCK_ACTIVE_LEAGUES)
}
