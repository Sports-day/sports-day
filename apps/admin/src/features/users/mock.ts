import type { User } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_USERS: User[] = loadFromStorage('admin_users', [
  { id: '1', name: 'Emma',   email: 'e2311222',  gender: '女性', class: 'Class A', teams: ['Team A-1'] },
  { id: '2', name: 'Sam',    email: 'Xo7oaltas', gender: '男性', class: 'Class A', teams: ['Team A-2'] },
  { id: '3', name: 'Amelia', email: '/akkaid',   gender: '女性', class: 'Class B', teams: ['Team B-1', 'Team C-1'] },
  { id: '4', name: 'nyo',    email: 'vkAsdaf',   gender: '女性', class: 'Class B', teams: ['Team B-2', 'Team C-2', 'Team C-3'] },
])

export function persistUsers() {
  saveToStorage('admin_users', MOCK_USERS)
}
