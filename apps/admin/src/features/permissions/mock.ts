import type { Role } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_ROLES: Role[] = loadFromStorage('admin_roles', [
  {
    id: '1', name: '管理者', description: 'すべての操作が可能', isDefault: false,
    permissions: [
      'competitions.view', 'competitions.edit', 'competitions.delete',
      'matches.view', 'matches.edit',
      'teams.view', 'teams.edit', 'teams.delete',
      'users.view', 'users.edit', 'users.delete',
      'locations.view', 'locations.edit',
      'information.view', 'information.edit',
      'images.view', 'images.edit',
      'roles.view', 'roles.edit',
      'tags.edit',
    ],
  },
  {
    id: '2', name: '一般', description: '閲覧と参加登録が可能', isDefault: true,
    permissions: [
      'competitions.view', 'matches.view', 'teams.view',
      'users.view', 'locations.view', 'information.view', 'images.view',
    ],
  },
  {
    id: '3', name: 'ゲスト', description: '閲覧のみ可能', isDefault: false,
    permissions: ['competitions.view', 'matches.view', 'information.view'],
  },
])

export function persistRoles() {
  saveToStorage('admin_roles', MOCK_ROLES)
}
