/** 個別の操作権限 */
export type Permission = {
  key: string
  label: string
  category: string
}

export type Role = {
  id: string
  name: string
  description: string
  isDefault: boolean
  /** このロールが持つ権限キーの一覧 */
  permissions: string[]
}

/** アプリで利用可能なすべての権限定義 */
export const ALL_PERMISSIONS: Permission[] = [
  { key: 'competitions.view', label: '競技の閲覧', category: '競技' },
  { key: 'competitions.edit', label: '競技の作成・編集', category: '競技' },
  { key: 'competitions.delete', label: '競技の削除', category: '競技' },
  { key: 'matches.view', label: '試合の閲覧', category: '試合' },
  { key: 'matches.edit', label: '試合スコアの入力・編集', category: '試合' },
  { key: 'teams.view', label: 'チームの閲覧', category: 'チーム' },
  { key: 'teams.edit', label: 'チームの作成・編集', category: 'チーム' },
  { key: 'teams.delete', label: 'チームの削除', category: 'チーム' },
  { key: 'users.view', label: 'ユーザーの閲覧', category: 'ユーザー' },
  { key: 'users.edit', label: 'ユーザーの作成・編集', category: 'ユーザー' },
  { key: 'users.delete', label: 'ユーザーの削除', category: 'ユーザー' },
  { key: 'locations.view', label: '場所の閲覧', category: '場所' },
  { key: 'locations.edit', label: '場所の作成・編集', category: '場所' },
  { key: 'information.view', label: 'お知らせの閲覧', category: 'お知らせ' },
  { key: 'information.edit', label: 'お知らせの作成・編集', category: 'お知らせ' },
  { key: 'images.view', label: '画像の閲覧', category: '画像' },
  { key: 'images.edit', label: '画像の管理', category: '画像' },
  { key: 'roles.view', label: 'ロールの閲覧', category: '権限管理' },
  { key: 'roles.edit', label: 'ロールの作成・編集', category: '権限管理' },
  { key: 'tags.edit', label: 'タグの管理', category: 'タグ' },
]
