import type { Role } from './types'
import { loadFromStorage, saveToStorage } from '@/lib/localStore'

export const MOCK_ROLES: Role[] = loadFromStorage('admin_roles', [
  { id: '1', name: '管理者', description: 'すべての操作が可能', isDefault: false },
  { id: '2', name: '一般', description: '閲覧と参加登録が可能', isDefault: true },
  { id: '3', name: 'ゲスト', description: '閲覧のみ可能', isDefault: false },
])

export function persistRoles() {
  saveToStorage('admin_roles', MOCK_ROLES)
}
