import { useMemo } from 'react'
import {
  useGetAdminCompetitionsQuery,
  useGetAdminLeaguesQuery,
  useGetAdminTeamsQuery,
  useGetAdminMatchesQuery,
} from '@/gql/__generated__/graphql'

// ─── リーグ色 ─────────────────────────────────────────
export const LEAGUE_COLORS = [
  { bg: '#FCE4EC' }, // ピンク
  { bg: '#FFF3E0' }, // オレンジ
  { bg: '#FFFDE7' }, // 黄
  { bg: '#E8F5E9' }, // 緑
  { bg: '#F3E5F5' }, // 紫
  { bg: '#E3F2FD' }, // 水色
  { bg: '#FBE9E7' }, // 薄オレンジ
  { bg: '#EDE7F6' }, // 薄紫
]

export type PdfTeamMember = {
  id: string
  name: string
}

export type PdfTeam = {
  id: string
  name: string
  groupName: string
  members: PdfTeamMember[]
}

export type PdfLeague = {
  id: string
  name: string
  colorIndex: number
  teams: PdfTeam[]
}

export type PdfScheduleMatch = {
  matchId: string
  time: string
  timeLabel: string
  orderNumber: number
  locationName: string
  leagueName: string
  leagueColorIndex: number
  teamA: string
  teamB: string
  judgmentLabel: string
}

export type CompetitionPdfData = {
  sportName: string
  sceneName: string
  leagues: PdfLeague[]
  schedule: PdfScheduleMatch[]
  locations: string[]
  loading: boolean
}

export function useCompetitionPdfData(sportId: string, sceneId: string, skip = false): CompetitionPdfData {
  const { data: compsData, loading: compsLoading } = useGetAdminCompetitionsQuery({ skip })
  const { data: leaguesData, loading: leaguesLoading } = useGetAdminLeaguesQuery({ skip })
  const { data: teamsData, loading: teamsLoading } = useGetAdminTeamsQuery({ skip })
  const { data: matchesData, loading: matchesLoading } = useGetAdminMatchesQuery({ skip })

  const loading = compsLoading || leaguesLoading || teamsLoading || matchesLoading

  return useMemo(() => {
    if (!compsData || !leaguesData || !teamsData || !matchesData) {
      return { sportName: '', sceneName: '', leagues: [], schedule: [], locations: [], loading }
    }

    // 同sport+sceneのLEAGUE競技を取得
    const leagueComps = compsData.competitions.filter(
      (c) => c.sport?.id === sportId && c.scene?.id === sceneId && c.type === 'LEAGUE',
    )

    if (leagueComps.length === 0) {
      return { sportName: '', sceneName: '', leagues: [], schedule: [], locations: [], loading }
    }

    const sportName = leagueComps[0].sport?.name ?? ''
    const sceneName = leagueComps[0].scene?.name ?? ''

    // チームID → チーム情報（メンバー付き）マップ
    const teamMap = new Map<string, typeof teamsData.teams[number]>()
    for (const t of teamsData.teams) {
      teamMap.set(t.id, t)
    }

    // リーグID → リーグのチームIDリスト（GET_ADMIN_LEAGUES から取得）
    const leagueTeamIdsMap = new Map<string, string[]>()
    for (const league of leaguesData.leagues) {
      leagueTeamIdsMap.set(league.id, league.teams.map((t) => t.id))
    }

    // 競技IDセット
    const compIds = new Set(leagueComps.map((c) => c.id))

    // 該当競技の試合を取得
    const compMatches = matchesData.matches.filter((m) => compIds.has(m.competition.id))

    // リーグ名でソート
    const sortedComps = [...leagueComps].sort((a, b) => a.name.localeCompare(b.name))

    // competition ID → リーグ名・色マップ
    const compNameMap = new Map<string, { name: string; colorIndex: number }>()
    sortedComps.forEach((c, i) => compNameMap.set(c.id, { name: c.name, colorIndex: i % LEAGUE_COLORS.length }))

    // リーグデータ構築（チームはcompetitionのエントリーから取得）
    const leaguesRaw = sortedComps.map((comp) => {
      const teamIds = leagueTeamIdsMap.get(comp.id) ?? []
      const teams: PdfTeam[] = teamIds
        .map((tid) => {
          const t = teamMap.get(tid)
          if (!t) return null
          return {
            id: t.id,
            name: t.name,
            groupName: t.group.name,
            members: t.users.map((u) => ({ id: u.id, name: '' })),
          }
        })
        .filter((t): t is PdfTeam => t !== null)
        .sort((a, b) => a.name.localeCompare(b.name))

      return { id: comp.id, name: comp.name, teams }
    }).filter((l) => l.teams.length > 0) // チーム0件のリーグは除外

    // フィルタ後に色を割り当て
    const leagues: PdfLeague[] = leaguesRaw.map((l, i) => ({
      ...l,
      colorIndex: i % LEAGUE_COLORS.length,
    }))

    // タイムスケジュール構築
    const allMatches: PdfScheduleMatch[] = compMatches
      .map((m) => {
        const compInfo = compNameMap.get(m.competition.id)
        const entry0 = m.entries[0]
        const entry1 = m.entries[1]
        const judgmentLabel = getJudgmentLabel(m.judgment, teamMap)

        return {
          matchId: m.id,
          time: m.time,
          timeLabel: formatTime(m.time),
          orderNumber: 0,
          locationName: m.location?.name ?? '',
          leagueName: compInfo?.name ?? '',
          leagueColorIndex: compInfo?.colorIndex ?? 0,
          teamA: entry0?.team?.name ?? '',
          teamB: entry1?.team?.name ?? '',
          judgmentLabel,
        }
      })
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime() || a.matchId.localeCompare(b.matchId))

    // 試合番号を付与
    allMatches.forEach((m, i) => { m.orderNumber = i + 1 })

    // 使用されているロケーション一覧
    const locationSet = new Set<string>()
    for (const m of allMatches) {
      if (m.locationName) locationSet.add(m.locationName)
    }
    const locations = [...locationSet].sort()

    return { sportName, sceneName, leagues, schedule: allMatches, locations, loading }
  }, [compsData, leaguesData, teamsData, matchesData, sportId, sceneId, loading])
}

function formatTime(time: string): string {
  try {
    const d = new Date(time)
    const h = d.getHours().toString().padStart(2, '0')
    const m = d.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  } catch {
    return time
  }
}

type JudgmentData = {
  id: string
  name?: string | null
  user?: { id: string } | null
  team?: { id: string } | null
  group?: { id: string } | null
} | null | undefined

function getJudgmentLabel(
  judgment: JudgmentData,
  teamMap: Map<string, { name: string; group: { id: string; name: string } }>,
): string {
  if (!judgment) return ''
  if (judgment.name) return judgment.name
  if (judgment.team?.id) {
    const t = teamMap.get(judgment.team.id)
    return t?.name ?? ''
  }
  if (judgment.group?.id) {
    for (const t of teamMap.values()) {
      if (t.group.id === judgment.group.id) return t.group.name
    }
  }
  return ''
}
