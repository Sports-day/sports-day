/**
 * 機能間の自動連携ロジック — GraphQL 移行後はスタブ。後続タスクで実装予定。
 */

// ─── #1 進出ルール実行 ───

/**
 * 【未確定】進出ルール実行は GraphQL API 未実装
 */
export function executeProgression(_competitionId: string, _leagueId: string): number {
  return 0
}

// ─── #2 リーグ名の一覧同期 ───

export function syncLeagueName(_leagueId: string, _newName: string) {
  // 【未確定】GraphQL 移行後は不要
}

// ─── #3 競技タグ → 子リーグ・トーナメントへの継承 ───

export function inheritCompetitionTag(_competitionId: string) {
  // 【未確定】GraphQL 移行後は不要
}

// ─── #4 チーム名変更の全体反映 ───

export function propagateTeamNameChange(_teamId: string, _newName: string) {
  // 【未確定】GraphQL 移行後は不要
}

// ─── #5 リーグ作成時に競技タグを自動設定 ───

export function getCompetitionTag(_competitionId: string): string {
  // 【未確定】GraphQL 移行後は不要
  return ''
}
