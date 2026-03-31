/**
 * 機能間の自動連携ロジックを集約するモジュール。
 * 各フックから呼び出して使う。
 */
import { MOCK_COMPETITIONS, MOCK_LEAGUE_DETAILS, MOCK_LEAGUES_BY_COMPETITION, MOCK_TOURNAMENT_DETAILS, MOCK_TOURNAMENTS_BY_COMPETITION, persistCompetitionsData } from '@/features/competitions/mock'
import { MOCK_ACTIVE_LEAGUES, persistActiveLeagues } from '@/features/matches/mock'

// ─── #1 進出ルール実行: リーグ順位 → トーナメントシード自動割当 ───

type TeamStats = { id: string; name: string; points: number; goalDiff: number; goalsFor: number }

function calcLeagueRankings(competitionId: string, leagueId: string): TeamStats[] {
  const leagues = MOCK_ACTIVE_LEAGUES[competitionId] ?? []
  const league = leagues.find((l) => l.id === leagueId)
  if (!league) return []

  const statsMap = new Map<string, TeamStats>()
  for (const t of league.teams) {
    statsMap.set(t.id, { id: t.id, name: t.name, points: 0, goalDiff: 0, goalsFor: 0 })
  }

  for (const m of league.matches) {
    if (m.status !== 'finished') continue
    const sA = m.scoreA ?? 0
    const sB = m.scoreB ?? 0
    const a = statsMap.get(m.teamAId)
    const b = statsMap.get(m.teamBId)
    if (a) { a.goalsFor += sA; a.goalDiff += sA - sB; a.points += sA > sB ? 3 : sA === sB ? 1 : 0 }
    if (b) { b.goalsFor += sB; b.goalDiff += sB - sA; b.points += sB > sA ? 3 : sA === sB ? 1 : 0 }
  }

  return Array.from(statsMap.values()).sort((a, b) =>
    b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor
  )
}

/**
 * 進出ルールを実行し、リーグの順位結果に基づいてトーナメントのシードを自動割当する。
 * @returns 割り当てたチーム数
 */
export function executeProgression(competitionId: string, leagueId: string): number {
  const detail = MOCK_LEAGUE_DETAILS[leagueId]
  if (!detail?.progressionEnabled || !detail.progressionRules?.length) return 0

  const rankings = calcLeagueRankings(competitionId, leagueId)
  if (rankings.length === 0) return 0

  let assigned = 0
  for (const rule of detail.progressionRules) {
    const team = rankings[rule.rank - 1]
    if (!team || !rule.targetId) continue

    const tournament = MOCK_TOURNAMENT_DETAILS[rule.targetId]
    if (!tournament) continue

    // シード番号 = rank（1位→Seed1, 2位→Seed2 ...）
    const seedNumber = rule.rank
    for (const bracket of tournament.brackets) {
      for (const match of bracket.matches) {
        for (const slot of [match.slot1, match.slot2]) {
          if (slot.sourceType === 'SEED' && slot.seedNumber === seedNumber) {
            slot.teamId = team.id
            slot.teamName = team.name
            assigned++
          }
        }
      }
    }
  }

  if (assigned > 0) persistCompetitionsData()
  return assigned
}

// ─── #2 リーグ名の一覧同期 ───

export function syncLeagueName(leagueId: string, newName: string) {
  for (const list of Object.values(MOCK_LEAGUES_BY_COMPETITION)) {
    const item = list.find((l) => l.id === leagueId)
    if (item && item.name !== newName) {
      item.name = newName
      persistCompetitionsData()
      break
    }
  }
}

// ─── #3 競技タグ → 子リーグ・トーナメントへの継承 ───

export function inheritCompetitionTag(competitionId: string) {
  const comp = MOCK_COMPETITIONS.find((c) => c.id === competitionId)
  if (!comp) return

  const tag = comp.tag
  // リーグ詳細のタグを更新
  const leagues = MOCK_LEAGUES_BY_COMPETITION[competitionId] ?? []
  for (const l of leagues) {
    const detail = MOCK_LEAGUE_DETAILS[l.id]
    if (detail && !detail.tag) {
      detail.tag = tag
    }
  }

  // トーナメント詳細のタグを更新
  const tournaments = MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] ?? []
  for (const t of tournaments) {
    const detail = MOCK_TOURNAMENT_DETAILS[t.id]
    if (detail && !detail.tag) {
      detail.tag = tag
    }
  }
  persistCompetitionsData()
}

// ─── #4 チーム名変更の全体反映 ───

export function propagateTeamNameChange(teamId: string, newName: string) {
  // リーグエントリーの更新
  for (const detail of Object.values(MOCK_LEAGUE_DETAILS)) {
    if (!detail.entries) continue
    for (const entry of detail.entries) {
      if ((entry as { teamId?: string }).teamId === teamId) {
        entry.teamName = newName
      }
    }
  }

  // MOCK_ACTIVE_LEAGUES のチーム名更新
  for (const leagues of Object.values(MOCK_ACTIVE_LEAGUES)) {
    for (const league of leagues) {
      for (const team of league.teams) {
        if (team.id === teamId) {
          team.name = newName
          team.shortName = newName
        }
      }
    }
  }

  // トーナメントスロットの更新
  for (const detail of Object.values(MOCK_TOURNAMENT_DETAILS)) {
    for (const bracket of detail.brackets) {
      for (const match of bracket.matches) {
        for (const slot of [match.slot1, match.slot2]) {
          if (slot.teamId === teamId) {
            slot.teamName = newName
          }
        }
      }
    }
  }

  persistCompetitionsData()
  persistActiveLeagues()
}

// ─── #5 リーグ作成時に競技タグを自動設定 ───

export function getCompetitionTag(competitionId: string): string {
  return MOCK_COMPETITIONS.find((c) => c.id === competitionId)?.tag ?? ''
}
