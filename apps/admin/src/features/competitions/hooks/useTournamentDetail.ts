import { useGetAdminTournamentQuery } from '@/gql/__generated__/graphql'
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

  // Match.id → round の計算（トポロジカル順）
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

export function useTournamentDetail(tournamentId: string, tournamentName: string): TournamentDetailView {
  const { data } = useGetAdminTournamentQuery({
    variables: { id: tournamentId },
    skip: !tournamentId,
  })

  if (!data?.tournament) {
    return {
      id: tournamentId,
      name: tournamentName,
      description: '',
      teamCount: 0,
      placementMethod: 'SEED_OPTIMIZED',
      tag: '',
      brackets: [],
    }
  }

  const t = data.tournament
  const bracket = buildBracket(t)

  return {
    id: t.id,
    name: t.name,
    description: '',
    teamCount: t.slots.length,
    placementMethod: (t.placementMethod ?? 'SEED_OPTIMIZED') as TournamentDetailView['placementMethod'],
    tag: '',
    brackets: [bracket],
  }
}
