import { Role } from '@/gql/__generated__/graphql'

/**
 * バックエンドの StaticAuthorizer と同等の権限マッピング。
 * バックエンド側: api/pkg/authz/authorizer.go
 */

const PERMISSION_MAP: Record<string, Set<Role>> = {
  'competition:write': new Set([Role.Admin, Role.Organizer]),
  'team:write':        new Set([Role.Admin, Role.Organizer]),
  'match:write':       new Set([Role.Admin, Role.Organizer]),
  'user:write':        new Set([Role.Admin, Role.Organizer]),
  'user:manage':       new Set([Role.Admin]),
  'group:write':       new Set([Role.Admin, Role.Organizer]),
  'sport:write':       new Set([Role.Admin, Role.Organizer]),
  'location:write':    new Set([Role.Admin, Role.Organizer]),
  'scene:write':       new Set([Role.Admin, Role.Organizer]),
  'information:write': new Set([Role.Admin, Role.Organizer]),
  'rule:write':        new Set([Role.Admin, Role.Organizer]),
  'image:write':       new Set([Role.Admin, Role.Organizer]),
}

/**
 * Sidebar のナビ項目キー → バックエンド permission へのマッピング。
 * Sidebar の permission は "xxx.view" / "xxx.edit" 形式だが、
 * バックエンドは write のみをガードしている。
 * read (query) は全ロールに開放されているので、
 * participant は admin パネルにはアクセスできるがwrite系操作は不可。
 *
 * ここでは「そのセクションを表示してよいか」を判定する。
 * participant でも閲覧は許可し、write 操作のUI (ボタン等) は別途非表示にする。
 */
const SIDEBAR_PERMISSION_MAP: Record<string, string> = {
  'sports.view':       'sport:write',
  'competitions.view': 'competition:write',
  'classes.view':      'group:write',
  'teams.view':        'team:write',
  'users.view':        'user:write',
  'locations.view':    'location:write',
  'tags.edit':         'scene:write',
  'images.view':       'image:write',
  'matches.view':      'match:write',
  'information.view':  'information:write',
}

/**
 * 指定ロールが指定パーミッションを持つかチェック。
 */
export function hasPermission(role: Role, permission: string): boolean {
  const allowed = PERMISSION_MAP[permission]
  if (!allowed) return false
  return allowed.has(role)
}

/**
 * Sidebar の checkPermission 用。
 * .view 系は全ロールに表示（read は全ロール許可）。
 * .edit 系のみ write 権限をチェックする。
 */
export function checkSidebarPermission(role: Role, sidebarKey: string): boolean {
  if (sidebarKey.endsWith('.view')) return true
  const backendPerm = SIDEBAR_PERMISSION_MAP[sidebarKey]
  if (!backendPerm) return true
  return hasPermission(role, backendPerm)
}

/**
 * 現在のユーザーが書き込み操作できるか（admin or organizer）。
 */
export function canWrite(role: Role): boolean {
  return role === Role.Admin || role === Role.Organizer
}

/**
 * 現在のユーザーがユーザー管理（ロール変更等）できるか（admin のみ）。
 */
export function canManageUsers(role: Role): boolean {
  return role === Role.Admin
}
