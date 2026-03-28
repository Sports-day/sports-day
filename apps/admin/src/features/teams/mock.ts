import type { Team, TeamMember, SelectableUser } from './types'

export const MOCK_TEAMS: Team[] = [
  { id: '1', name: 'Team A-1', class: 'Class A', tags: ['バスケットボール晴天時'] },
  { id: '2', name: 'Team A-2', class: 'Class A', tags: ['バスケットボール雨天時'] },
  { id: '3', name: 'Team B-1', class: 'Class B', tags: ['バスケットボール晴天時'] },
  { id: '4', name: 'Team B-2', class: 'Class B', tags: ['バスケットボール雨天時'] },
]

export const MOCK_SELECTABLE_USERS: SelectableUser[] = [
  { id: '3', userName: 'Emma', gender: '女性', studentId: 'e2311222' },
  { id: '4', userName: '田中太郎', gender: '男性', studentId: 's1234567' },
  { id: '5', userName: '山田花子', gender: '女性', studentId: 's7654321' },
]

export const MOCK_TEAM_MEMBERS: Record<string, TeamMember[]> = {
  '1': [
    { studentId: '1', name: 'デモ', gender: '男性' },
    { studentId: '2', name: 'Olivia', gender: '女性' },
    { studentId: '10', name: 'デモ3', gender: '男性' },
  ],
  '2': [],
  '3': [],
  '4': [],
}
