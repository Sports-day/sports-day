import { useState } from 'react'
import {
  MOCK_TOURNAMENTS_BY_COMPETITION,
  MOCK_TOURNAMENT_DETAILS,
  persistCompetitionsData,
} from '../mock'
import type { MockBracket, MockTMatch, MockTSlot, MockTournamentDetailData } from '../mock'

// ─── Types ───────────────────────────────────────────────

export type TournamentCreateForm = {
  name: string
  description: string
  teamCount: number
  hasThirdPlace: boolean
  hasFifthPlace: boolean
  placementMethod: 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'
  tag: string
}

const INITIAL_FORM: TournamentCreateForm = {
  name: '',
  description: '',
  teamCount: 4,
  hasThirdPlace: false,
  hasFifthPlace: false,
  placementMethod: 'SEED_OPTIMIZED',
  tag: '',
}

// ─── Bracket generation ──────────────────────────────────

type BracketNode =
  | { type: 'seed'; seedNumber: number }
  | { type: 'bye' }
  | { type: 'match'; matchId: string }

function nextPow2(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}

/** 標準シード順（上位シード同士が終盤まで当たらない配列）を返す */
function getSeedOrder(size: number): number[] {
  if (size === 2) return [1, 2]
  const prev = getSeedOrder(size / 2)
  return prev.flatMap((s) => [s, size + 1 - s])
}

function nodeToSlot(node: BracketNode): MockTSlot {
  if (node.type === 'seed')
    return { sourceType: 'SEED', seedNumber: node.seedNumber, teamId: null, teamName: null }
  if (node.type === 'match')
    return { sourceType: 'MATCH_WINNER', sourceMatchId: node.matchId, teamId: null, teamName: null }
  throw new Error('BYE node cannot become a slot')
}

function getMatchLabel(round: number, maxRound: number, indexInRound: number): string {
  const NUMS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧']
  const num = NUMS[indexInRound] ?? `${indexInRound + 1}`
  const fromFinal = maxRound - round
  if (fromFinal === 0) return '決勝'
  if (fromFinal === 1) return `準決勝${num}`
  if (fromFinal === 2) return `準々決勝${num}`
  return `第${round + 1}ラウンド ${num}`
}

/**
 * MAINブラケットの試合リストを生成する。
 * BYE はダミー試合を作らず、上位シードを次ラウンドのSEEDスロットに直接配置する。
 */
function generateMainMatches(teamCount: number, prefix: string): MockTMatch[] {
  if (teamCount < 2) return []

  const bracketSize = nextPow2(teamCount)
  const orderedSeeds = getSeedOrder(bracketSize)

  // 各ポジションが実際のシード（1〜teamCount）か BYE かを初期設定
  let layer: BracketNode[] = orderedSeeds.map((seed) =>
    seed <= teamCount
      ? ({ type: 'seed', seedNumber: seed } as BracketNode)
      : ({ type: 'bye' } as BracketNode),
  )

  const allMatches: MockTMatch[] = []
  let counter = 0
  let round = 0

  while (layer.length > 1) {
    const nextLayer: BracketNode[] = []

    for (let i = 0; i < layer.length; i += 2) {
      const a = layer[i]
      const b = layer[i + 1]

      // 両方 BYE → BYE を繰り上げ
      if (a.type === 'bye' && b.type === 'bye') {
        nextLayer.push({ type: 'bye' })
        continue
      }
      // 片方 BYE → 相手をそのまま繰り上げ（BYE試合は作らない）
      if (a.type === 'bye') { nextLayer.push(b); continue }
      if (b.type === 'bye') { nextLayer.push(a); continue }

      // 両方アクティブ → 試合を作成
      const matchId = `${prefix}_m${counter++}`
      allMatches.push({
        id: matchId,
        round,
        label: '',          // 後で一括設定
        slot1: nodeToSlot(a),
        slot2: nodeToSlot(b),
        score1: null,
        score2: null,
        winnerTeamId: null,
        status: 'STANDBY',
      })
      nextLayer.push({ type: 'match', matchId })
    }

    layer = nextLayer
    round++
  }

  // ラウンドラベルを一括設定
  const maxRound = allMatches.length > 0 ? Math.max(...allMatches.map((m) => m.round)) : 0
  const roundIdx: Record<number, number> = {}
  for (const m of allMatches) {
    const idx = roundIdx[m.round] ?? 0
    roundIdx[m.round] = idx + 1
    m.label = getMatchLabel(m.round, maxRound, idx)
  }

  return allMatches
}

/** 3位決定戦ブラケットを生成する（MAINの準決勝敗者2チーム） */
function generateThirdPlaceBracket(mainMatches: MockTMatch[], prefix: string): MockBracket | null {
  const maxRound = mainMatches.length > 0 ? Math.max(...mainMatches.map((m) => m.round)) : -1
  const semiFinals = mainMatches.filter((m) => m.round === maxRound - 1)
  if (semiFinals.length < 2) return null

  const match: MockTMatch = {
    id: `${prefix}_3rd_m0`,
    round: 0,
    label: '3位決定戦',
    slot1: { sourceType: 'MATCH_LOSER', sourceMatchId: semiFinals[0].id, teamId: null, teamName: null },
    slot2: { sourceType: 'MATCH_LOSER', sourceMatchId: semiFinals[1].id, teamId: null, teamName: null },
    score1: null,
    score2: null,
    winnerTeamId: null,
    status: 'STANDBY',
  }

  return {
    id: `${prefix}_3rd`,
    name: '3位決定戦',
    bracketType: 'SUB',
    displayOrder: 2,
    matches: [match],
  }
}

/** 5〜8位決定戦ブラケットを生成する（MAINの準々決勝敗者4チーム） */
function generateFifthPlaceBracket(mainMatches: MockTMatch[], prefix: string): MockBracket | null {
  const maxRound = mainMatches.length > 0 ? Math.max(...mainMatches.map((m) => m.round)) : -1
  const quarterFinals = mainMatches.filter((m) => m.round === maxRound - 2)
  if (quarterFinals.length < 4) return null

  const sf1Id = `${prefix}_5th_sf1`
  const sf2Id = `${prefix}_5th_sf2`
  const finalId = `${prefix}_5th_final`

  const matches: MockTMatch[] = [
    {
      id: sf1Id, round: 0, label: '5-8位 準決勝①',
      slot1: { sourceType: 'MATCH_LOSER', sourceMatchId: quarterFinals[0].id, teamId: null, teamName: null },
      slot2: { sourceType: 'MATCH_LOSER', sourceMatchId: quarterFinals[1].id, teamId: null, teamName: null },
      score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
    },
    {
      id: sf2Id, round: 0, label: '5-8位 準決勝②',
      slot1: { sourceType: 'MATCH_LOSER', sourceMatchId: quarterFinals[2].id, teamId: null, teamName: null },
      slot2: { sourceType: 'MATCH_LOSER', sourceMatchId: quarterFinals[3].id, teamId: null, teamName: null },
      score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
    },
    {
      id: finalId, round: 1, label: '5-8位 決定戦',
      slot1: { sourceType: 'MATCH_WINNER', sourceMatchId: sf1Id, teamId: null, teamName: null },
      slot2: { sourceType: 'MATCH_WINNER', sourceMatchId: sf2Id, teamId: null, teamName: null },
      score1: null, score2: null, winnerTeamId: null, status: 'STANDBY',
    },
  ]

  return {
    id: `${prefix}_5th`,
    name: '5〜8位決定戦',
    bracketType: 'SUB',
    displayOrder: 3,
    matches,
  }
}

/** フォームの内容からトーナメントデータ全体を生成する */
export function generateTournamentData(
  form: TournamentCreateForm,
  id: string,
): MockTournamentDetailData {
  const prefix = id
  const mainMatches = generateMainMatches(form.teamCount, prefix)

  const mainBracket: MockBracket = {
    id: `${prefix}_main`,
    name: 'メインブラケット',
    bracketType: 'MAIN',
    displayOrder: 1,
    matches: mainMatches,
  }

  const brackets: MockBracket[] = [mainBracket]

  if (form.hasThirdPlace) {
    const sub = generateThirdPlaceBracket(mainMatches, prefix)
    if (sub) brackets.push(sub)
  }

  if (form.hasFifthPlace) {
    const sub = generateFifthPlaceBracket(mainMatches, prefix)
    if (sub) brackets.push(sub)
  }

  return {
    id,
    name: form.name,
    description: form.description,
    teamCount: form.teamCount,
    hasThirdPlace: form.hasThirdPlace,
    hasFifthPlace: form.hasFifthPlace,
    placementMethod: form.placementMethod,
    tag: form.tag,
    brackets,
  }
}

// ─── Hook ────────────────────────────────────────────────

export function useTournamentCreate(competitionId: string, onSave: () => void) {
  const [form, setForm] = useState<TournamentCreateForm>(INITIAL_FORM)

  const handleChange =
    (field: keyof TournamentCreateForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === 'teamCount' ? Number(e.target.value) : e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleToggle = (field: 'hasThirdPlace' | 'hasFifthPlace') => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    if (form.teamCount < 2) return

    const newId = `tournament_${Date.now()}`

    // モックデータにブラケット構造を自動生成して登録
    MOCK_TOURNAMENT_DETAILS[newId] = generateTournamentData(form, newId)

    // トーナメント一覧に追加
    if (!MOCK_TOURNAMENTS_BY_COMPETITION[competitionId]) {
      MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] = []
    }
    MOCK_TOURNAMENTS_BY_COMPETITION[competitionId].push({ id: newId, name: form.name })

    persistCompetitionsData()
    onSave()
  }

  return { form, handleChange, handleToggle, handleSubmit }
}
