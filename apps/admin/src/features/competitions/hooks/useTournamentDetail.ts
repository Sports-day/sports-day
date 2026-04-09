import { useGetAdminTournamentQuery, useGetAdminTournamentsQuery } from '@/gql/__generated__/graphql'
import type { BracketView, TournamentMatchView, TournamentSlotView, TournamentDetailView } from '../types'

/**
 * GQL TournamentSlot + Match → BracketView へのマッピング
 *
 * 各 Match は 2つの MatchEntry を持ち、各 TournamentSlot は matchEntry で
 * どの MatchEntry に対応するかを示す。
 * round は SEED スロット → 0、MATCH_WINNER/LOSER → sourceMatch.round + 1 で計算する。
 */
function buildBracket(tournament: NonNullable<ReturnType<typeof useGetAdminTournamentQuery>['data']>['tournament']): BracketView {
  if (!tournament) {
    return { id: '', name: '', bracketType: 'MAIN', displayOrder: 0, matches: [] }
  }

  const matches = tournament.matches
  const slots = tournament.slots

  // MatchEntry.id → TournamentSlot のマップ
  const entryToSlot = new Map<string, typeof slots[number]>()
  for (const slot of slots) {
    if (slot.matchEntry) {
      entryToSlot.set(slot.matchEntry.id, slot)
    }
  }

  // Match.id → round の計算（トポロジカル順：前方パス）
  const matchRound = new Map<string, number>()
  let changed = true
  while (changed) {
    changed = false
    for (const match of matches) {
      if (matchRound.has(match.id)) continue
      const entry0 = match.entries[0]
      const entry1 = match.entries[1]
      const slot0 = entry0 ? entryToSlot.get(entry0.id) : undefined
      const slot1 = entry1 ? entryToSlot.get(entry1.id) : undefined

      const getRound = (slot: typeof slots[number] | undefined): number | undefined => {
        if (!slot || slot.sourceType === 'SEED') return 0
        if (slot.sourceMatch) {
          const r = matchRound.get(slot.sourceMatch.id)
          return r !== undefined ? r + 1 : undefined
        }
        return 0
      }

      const r0 = getRound(slot0)
      const r1 = getRound(slot1)
      if (r0 !== undefined && r1 !== undefined) {
        matchRound.set(match.id, Math.max(r0, r1))
        changed = true
      }
    }
  }

  const toMockSlot = (
    slot: typeof slots[number] | undefined,
    entry: typeof matches[number]['entries'][number] | undefined,
  ): TournamentSlotView => {
    if (!slot) return { sourceType: 'SEED' }
    return {
      slotId: slot.id,
      sourceType: slot.sourceType as TournamentSlotView['sourceType'],
      seedNumber: slot.seedNumber ?? undefined,
      sourceMatchId: slot.sourceMatch?.id,
      teamId: entry?.team?.id ?? null,
      teamName: entry?.team?.name ?? null,
    }
  }

  const toStatus = (s: string): TournamentMatchView['status'] => {
    if (s === 'ONGOING') return 'ONGOING'
    if (s === 'FINISHED') return 'FINISHED'
    return 'STANDBY'
  }

  const mockMatches: TournamentMatchView[] = matches.map((match) => {
    const entry0 = match.entries[0]
    const entry1 = match.entries[1]
    const slot0 = entry0 ? entryToSlot.get(entry0.id) : undefined
    const slot1 = entry1 ? entryToSlot.get(entry1.id) : undefined
    return {
      id: match.id,
      round: matchRound.get(match.id) ?? 0,
      slot1: toMockSlot(slot0, entry0),
      slot2: toMockSlot(slot1, entry1),
      score1: entry0?.score ?? null,
      score2: entry1?.score ?? null,
      winnerTeamId: match.winnerTeam?.id ?? null,
      status: toStatus(match.status),
    }
  })

  return {
    id: tournament.id,
    name: tournament.name,
    bracketType: tournament.bracketType as BracketView['bracketType'],
    displayOrder: tournament.displayOrder ?? 0,
    matches: mockMatches,
  }
}

export function useTournamentDetail(competitionId: string, tournamentName: string): TournamentDetailView {
  // competitionIdから全トーナメント（MAIN + SUB）を取得
  const { data: tournamentsData } = useGetAdminTournamentsQuery({
    variables: { competitionId },
    skip: !competitionId,
  })
  const allTournaments = tournamentsData?.tournaments ?? []
  const mainTournament = allTournaments.find(t => t.bracketType === 'MAIN')
  const resolvedTournamentId = mainTournament?.id ?? ''

  // 全ブラケットの詳細を取得（MAINは個別に、SUBも個別に）
  const { data: mainData } = useGetAdminTournamentQuery({
    variables: { id: resolvedTournamentId },
    skip: !resolvedTournamentId,
  })

  // SUBブラケットのIDリストを取得
  const subTournaments = allTournaments.filter(t => t.bracketType === 'SUB')

  // 各SUBの詳細を取得（最大10個まで対応）
  const sub0 = useGetAdminTournamentQuery({ variables: { id: subTournaments[0]?.id ?? '' }, skip: !subTournaments[0] })
  const sub1 = useGetAdminTournamentQuery({ variables: { id: subTournaments[1]?.id ?? '' }, skip: !subTournaments[1] })
  const sub2 = useGetAdminTournamentQuery({ variables: { id: subTournaments[2]?.id ?? '' }, skip: !subTournaments[2] })
  const sub3 = useGetAdminTournamentQuery({ variables: { id: subTournaments[3]?.id ?? '' }, skip: !subTournaments[3] })
  const sub4 = useGetAdminTournamentQuery({ variables: { id: subTournaments[4]?.id ?? '' }, skip: !subTournaments[4] })
  const subQueries = [sub0, sub1, sub2, sub3, sub4]

  const brackets: BracketView[] = []

  // MAINブラケット
  if (mainData?.tournament) {
    brackets.push(buildBracket(mainData.tournament))
  }

  // SUBブラケット
  for (let i = 0; i < subTournaments.length && i < 5; i++) {
    const subData = subQueries[i]?.data
    if (subData?.tournament) {
      brackets.push(buildBracket(subData.tournament))
    }
  }

  const t = mainData?.tournament

  return {
    id: resolvedTournamentId || competitionId,
    name: t?.name ?? tournamentName,
    description: '',
    teamCount: t?.slots?.length ?? 0,
    placementMethod: (t?.placementMethod ?? 'SEED_OPTIMIZED') as TournamentDetailView['placementMethod'],
    tag: '',
    sportId: '',
    sceneId: '',
    brackets,
  }
}
