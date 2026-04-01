/**
 * フロントエンドのみの認証状態管理。
 * localStorage にログイン状態とロールを永続化する。
 */
import { loadFromStorage, saveToStorage } from './localStore'
import { MOCK_ROLES } from '@/features/permissions/mock'
import type { Role } from '@/features/permissions/types'

const AUTH_KEY = 'admin_auth'

type AuthState = {
  loggedIn: boolean
  roleId: string | null
}

let _state: AuthState = loadFromStorage<AuthState>(AUTH_KEY, { loggedIn: false, roleId: null })
const _listeners = new Set<() => void>()

function persist() {
  saveToStorage(AUTH_KEY, _state)
  _listeners.forEach((fn) => fn())
}

export function getAuth(): AuthState {
  return _state
}

/** 管理者ロール（ID '1'）で固定ログイン */
export function login() {
  const adminRole = MOCK_ROLES.find((r) => r.name === '管理者') ?? MOCK_ROLES[0]
  _state = { loggedIn: true, roleId: adminRole?.id ?? '1' }
  persist()
}

export function logout() {
  _state = { loggedIn: false, roleId: null }
  persist()
}

export function getCurrentRole(): Role | null {
  if (!_state.roleId) return null
  return MOCK_ROLES.find((r) => r.id === _state.roleId) ?? null
}

/** 現在のロールが指定の権限を持っているか */
export function hasPermission(key: string): boolean {
  const role = getCurrentRole()
  if (!role) return false
  return role.permissions.includes(key)
}

export function subscribeAuth(fn: () => void): () => void {
  _listeners.add(fn)
  return () => { _listeners.delete(fn) }
}
