import { useState, useMemo } from 'react'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import type { BracketView, TournamentMatchView, TournamentSlotView } from '../types'

// ─── Layout constants ────────────────────────────────────
const MATCH_W = 260
const MATCH_H = 128    // card height (header ~36 + row1 46 + row2 46)
const H_GAP = 48       // horizontal gap between round columns
const V_GAP = 8        // vertical gap between matches in the same round
const SLOT_H = MATCH_H + V_GAP  // height of one original "seed pair" slot
const ROUND_LABEL_H = 20

const C = {
  border: 'rgba(63,81,181,0.22)',
  connector: '#5B6DC6',
  header: '#ECEEF8',
  headerText: '#3949AB',
  winnerBg: '#E8EAF6',
  winnerAccent: '#3949AB',
  dimText: '#9E9E9E',
  bodyText: '#37474F',
  roundLabel: '#3949AB',
  mainAccent: '#3949AB',
  subAccent: '#7B1FA2',
  emptySeed: '#90A4AE',
  statusFinished: '#4CAF50',
  statusOngoing: '#FF9800',
  statusStandby: '#E0E0E0',
}

// ─── Bracket layout math ─────────────────────────────────
//
// For MAIN brackets, we use the "original bracket size" (nextPow2 of teamCount)
// to compute Y positions so that BYE-collapsed matches still align correctly.
//
// Each pair of seeds in the original bracket occupies SLOT_H of vertical space.
// totalHeight = (bracketSize / 2) * SLOT_H
//
// For SUB brackets (all MATCH_LOSER slots), we use the simple round-doubling formula.

function colX(r: number) { return r * (MATCH_W + H_GAP) }

/**
 * Compute center-Y for every match and the total bracket height.
 *
 * MAIN brackets: derive positions from the seeding order so that BYE-advanced
 * seeds occupy the right amount of vertical space even when they have no card.
 *
 * SUB brackets: simple power-of-2 round layout (always works because SUB
 * brackets have a uniform number of feeder matches per round).
 */
/** Padding above the first card and below the last card */
const Y_PAD = V_GAP

/**
 * ブラケットのツリー構造から各試合のY座標を計算する。
 *
 * アルゴリズム:
 *   1. 試合データからツリーを構築（各試合の2スロットが子ノード）
 *   2. ルートを特定（他の試合から参照されない試合 = 決勝）
 *   3. DFS で葉ノードに順番にスロット位置を割り当て
 *   4. 内部ノード（上位ラウンド試合）は2つの子の中央に配置
 *
 * これにより標準ブラケット / all-play fold / play-in 等の
 * あらゆるブラケット構造で正しいレイアウトが得られる。
 */
function computeLayout(
  matches: TournamentMatchView[],
  _bracketType: BracketView['bracketType'],
): { matchCenterY: Map<string, number>; totalHeight: number } {
  if (matches.length === 0) return { matchCenterY: new Map(), totalHeight: SLOT_H }

  // ── Step 1: lookup テーブル構築 ──
  const matchMap = new Map<string, TournamentMatchView>()
  for (const m of matches) matchMap.set(m.id, m)

  // ── Step 2: ルート特定（他の試合から参照されない試合） ──
  const referenced = new Set<string>()
  for (const m of matches) {
    if (m.slot1.sourceMatchId && matchMap.has(m.slot1.sourceMatchId)) {
      referenced.add(m.slot1.sourceMatchId)
    }
    if (m.slot2.sourceMatchId && matchMap.has(m.slot2.sourceMatchId)) {
      referenced.add(m.slot2.sourceMatchId)
    }
  }
  const roots = matches
    .filter((m) => !referenced.has(m.id))
    .sort((a, b) => b.round - a.round)

  // ── Step 3-4: DFS で Y 座標割り当て ──
  const matchCenterY = new Map<string, number>()
  let leafIdx = 0

  function visit(matchId: string): number {
    if (matchCenterY.has(matchId)) return matchCenterY.get(matchId)!

    const match = matchMap.get(matchId)
    if (!match) {
      // 別ブラケットの試合 → 仮想リーフ
      const y = leafIdx * SLOT_H + SLOT_H / 2
      leafIdx++
      return y
    }

    const s1Id = match.slot1.sourceMatchId
    const s2Id = match.slot2.sourceMatchId
    const s1InBracket = !!(s1Id && matchMap.has(s1Id))
    const s2InBracket = !!(s2Id && matchMap.has(s2Id))

    // 葉ノード: 両スロットにフィーダー試合なし（R0のSEED試合等）
    if (!s1InBracket && !s2InBracket) {
      const y = leafIdx * SLOT_H + SLOT_H / 2
      leafIdx++
      matchCenterY.set(matchId, y)
      return y
    }

    // 片方だけフィーダー試合あり（もう片方はBYE/SEED）→ フィーダーと同じYに配置
    // BYEに仮想リーフを割り当てないことで、線が水平になりコンパクトに収まる
    if (s1InBracket && !s2InBracket) {
      const y = visit(s1Id!)
      matchCenterY.set(matchId, y)
      return y
    }
    if (!s1InBracket && s2InBracket) {
      const y = visit(s2Id!)
      matchCenterY.set(matchId, y)
      return y
    }

    // 両方フィーダー試合あり → 2つの子の中央に配置
    const topY = visit(s1Id!)
    const botY = visit(s2Id!)
    const y = (topY + botY) / 2
    matchCenterY.set(matchId, y)
    return y
  }

  for (const root of roots) {
    visit(root.id)
  }

  // 孤立試合の安全策
  for (const m of matches) {
    if (!matchCenterY.has(m.id)) {
      matchCenterY.set(m.id, leafIdx * SLOT_H + SLOT_H / 2)
      leafIdx++
    }
  }

  // ── 正規化: 上端をパディングに揃え、高さを算出 ──
  if (matchCenterY.size === 0) return { matchCenterY, totalHeight: SLOT_H }
  const allY = Array.from(matchCenterY.values())
  const minCenter = Math.min(...allY)
  const maxCenter = Math.max(...allY)
  const offset = minCenter - MATCH_H / 2 - Y_PAD
  for (const [k, v] of matchCenterY) {
    matchCenterY.set(k, v - offset)
  }
  const totalHeight = (maxCenter - offset) + MATCH_H / 2 + Y_PAD
  return { matchCenterY, totalHeight }
}

// ─── Helpers ────────────────────────────────────────────

function getSlotLabel(slot: TournamentSlotView): string {
  if (slot.teamName) return slot.teamName
  if (slot.sourceType === 'SEED' && slot.seedNumber != null) return `Seed ${slot.seedNumber}`
  if (slot.sourceType === 'MATCH_WINNER') return '勝者待ち'
  if (slot.sourceType === 'MATCH_LOSER') return '敗者待ち'
  return '未定'
}

function isEmptySeed(slot: TournamentSlotView): boolean {
  return slot.sourceType === 'SEED' && !slot.teamName
}

function getRoundLabel(round: number, maxRound: number, matchCountInRound: number): string {
  const fromFinal = maxRound - round
  if (fromFinal === 0) return '決勝'
  if (fromFinal === 1) return '準決勝'
  if (matchCountInRound === 4) return '準々決勝'
  return `${fromFinal + 1}回戦`
}

function getProgress(matches: TournamentMatchView[]): { finished: number; total: number } {
  return {
    total: matches.length,
    finished: matches.filter((m) => m.status === 'FINISHED').length,
  }
}

// ─── StatusBadge ─────────────────────────────────────────

function StatusBadge({ status }: { status: TournamentMatchView['status'] }) {
  if (status === 'FINISHED')
    return <Chip label="終了" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: '10px', height: 18, fontWeight: 600 }} />
  if (status === 'ONGOING')
    return <Chip label="進行中" size="small" sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontSize: '10px', height: 18, fontWeight: 600 }} />
  return <Chip label="未開始" size="small" sx={{ bgcolor: '#F5F5F5', color: '#9E9E9E', fontSize: '10px', height: 18 }} />
}

// ─── TeamRow ─────────────────────────────────────────────

function TeamRow({ label, score, isWinner, isLoser, isBottom, empty, seedNumber, onSeedClick }: {
  label: string; score: number | null | undefined
  isWinner: boolean; isLoser: boolean; isBottom: boolean; empty: boolean
  seedNumber?: number
  onSeedClick?: (e: React.MouseEvent) => void
}) {
  const isSeedSlot = seedNumber != null
  return (
    <Box
      onClick={isSeedSlot && onSeedClick ? (e) => { e.stopPropagation(); onSeedClick(e) } : undefined}
      sx={{
        display: 'flex', alignItems: 'center', px: 1.5, minHeight: 46,
        borderTop: isBottom ? `1px solid rgba(63,81,181,0.12)` : 'none',
        backgroundColor: isWinner ? C.winnerBg : (empty ? 'rgba(236,239,241,0.4)' : 'transparent'),
        opacity: isLoser ? 0.4 : 1,
        cursor: isSeedSlot && onSeedClick ? 'pointer' : 'inherit',
        transition: 'background-color 0.15s, opacity 0.15s',
        '&:hover': isSeedSlot && onSeedClick ? { backgroundColor: '#E3F2FD', opacity: 1 } : {},
      }}
    >
      {isSeedSlot && (
        <Chip
          label={`S${seedNumber}`}
          size="small"
          sx={{
            height: 18, fontSize: '10px', fontWeight: 700, mr: 0.75, flexShrink: 0,
            bgcolor: empty ? '#ECEFF1' : '#E8EAF6', color: empty ? C.emptySeed : C.headerText,
            minWidth: 0,
          }}
        />
      )}
      <Typography noWrap sx={{
        fontSize: '13px', flex: 1, minWidth: 0,
        color: empty ? C.emptySeed : (isWinner ? C.headerText : C.bodyText),
        fontWeight: isWinner ? 700 : 400,
        fontStyle: empty ? 'italic' : 'normal',
      }}>
        {label}
      </Typography>
      {empty ? (
        <Chip
          label="未割当"
          size="small"
          variant="outlined"
          sx={{
            height: 18, fontSize: '10px', ml: 0.5,
            borderColor: C.emptySeed, color: C.emptySeed, borderStyle: 'dashed',
          }}
        />
      ) : (
        <Typography sx={{
          fontSize: '20px', fontWeight: 700,
          color: isWinner ? C.winnerAccent : (score != null ? C.bodyText : C.dimText),
          minWidth: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.2,
        }}>
          {score != null ? score : '−'}
        </Typography>
      )}
    </Box>
  )
}

// ─── MatchCard ───────────────────────────────────────────

type MatchCardProps = {
  match: TournamentMatchView
  orderNumber?: number
  onClick?: (match: TournamentMatchView) => void
  onSeedClick?: (seedNumber: number, currentTeamId: string | null | undefined, anchorEl: HTMLElement, slotId: string | undefined) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragEnd?: () => void
  onDrop?: (e: React.DragEvent) => void
  isDragOver?: boolean
}

function MatchCard({ match, orderNumber, onClick, onSeedClick, draggable, onDragStart, onDragOver, onDragEnd, onDrop, isDragOver }: MatchCardProps) {
  const { slot1, slot2, score1, score2, winnerTeamId, status } = match
  const win1 = !!(winnerTeamId && winnerTeamId === slot1.teamId)
  const win2 = !!(winnerTeamId && winnerTeamId === slot2.teamId)

  const handleSeedClick = (slot: TournamentSlotView) => (e: React.MouseEvent) => {
    if (onSeedClick && slot.sourceType === 'SEED' && slot.seedNumber != null) {
      onSeedClick(slot.seedNumber, slot.teamId, e.currentTarget as HTMLElement, slot.slotId)
    }
  }

  return (
    <Box
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onClick={onClick ? () => onClick(match) : undefined}
      sx={{
        width: MATCH_W,
        border: `1px solid ${isDragOver ? C.winnerAccent : C.border}`,
        borderRadius: 2,
        overflow: 'hidden', backgroundColor: '#FFFFFF',
        boxShadow: isDragOver
          ? `0 0 0 2px ${C.winnerAccent}40, 0 4px 16px rgba(63,81,181,0.22)`
          : '0 2px 8px rgba(63,81,181,0.10), 0 1px 2px rgba(0,0,0,0.04)',
        cursor: draggable ? 'grab' : (onClick ? 'pointer' : 'default'),
        transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
        '&:hover': onClick || draggable ? {
          boxShadow: '0 6px 20px rgba(63,81,181,0.22)',
          transform: 'translateY(-2px)',
        } : {},
        '&:active': draggable ? { cursor: 'grabbing' } : {},
      }}
    >
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 1.5, py: 0.5, backgroundColor: C.header,
        borderBottom: `1px solid rgba(63,81,181,0.12)`, minHeight: 28,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {orderNumber != null && (
            <Typography sx={{ fontSize: '11px', color: '#8890C4', fontWeight: 700, lineHeight: 1 }}>
              #{orderNumber}
            </Typography>
          )}
          <Typography sx={{ fontSize: '11px', color: C.headerText, fontWeight: 700, letterSpacing: 0.3 }}>
            {match.label ?? '試合'}
          </Typography>
        </Box>
        <StatusBadge status={status} />
      </Box>
      <TeamRow
        label={getSlotLabel(slot1)} score={score1} isWinner={win1} isLoser={win2} isBottom={false}
        empty={isEmptySeed(slot1)}
        seedNumber={slot1.sourceType === 'SEED' ? slot1.seedNumber : undefined}
        onSeedClick={onSeedClick && slot1.sourceType === 'SEED' ? handleSeedClick(slot1) : undefined}
      />
      <TeamRow
        label={getSlotLabel(slot2)} score={score2} isWinner={win2} isLoser={win1} isBottom
        empty={isEmptySeed(slot2)}
        seedNumber={slot2.sourceType === 'SEED' ? slot2.seedNumber : undefined}
        onSeedClick={onSeedClick && slot2.sourceType === 'SEED' ? handleSeedClick(slot2) : undefined}
      />
    </Box>
  )
}

// ─── Bracket status ──────────────────────────────────────

function getBracketStatus(bracket: BracketView): { label: string; color: string; bg: string } {
  const { matches } = bracket
  if (matches.length === 0) return { label: '構築中', color: '#9E9E9E', bg: '#F5F5F5' }
  if (matches.every((m) => m.status === 'FINISHED')) return { label: '完了', color: '#2E7D32', bg: '#E8F5E9' }
  if (matches.some((m) => m.status === 'ONGOING' || m.status === 'FINISHED'))
    return { label: '進行中', color: '#E65100', bg: '#FFF3E0' }
  const allSeedsFilled = matches.every(
    (m) =>
      (m.slot1.sourceType !== 'SEED' || m.slot1.teamId) &&
      (m.slot2.sourceType !== 'SEED' || m.slot2.teamId),
  )
  if (allSeedsFilled) return { label: '準備完了', color: '#1565C0', bg: '#E3F2FD' }
  return { label: '構築中', color: '#9E9E9E', bg: '#F5F5F5' }
}

// ─── BracketTree (horizontal layout) ─────────────────────

function BracketTree({ matches, bracketType, onMatchClick, onSeedClick, onSwapMatches }: {
  matches: TournamentMatchView[]
  bracketType: BracketView['bracketType']
  onMatchClick?: (match: TournamentMatchView) => void
  onSeedClick?: (seedNumber: number, currentTeamId: string | null | undefined, anchorEl: HTMLElement, slotId: string | undefined) => void
  onSwapMatches?: (matchA: TournamentMatchView, matchB: TournamentMatchView) => void
}) {
  const [dragOverMatchId, setDragOverMatchId] = useState<string | null>(null)

  // 試合順番マップ（time昇順 → 1-indexed）
  const matchOrderMap = useMemo(() => {
    const map = new Map<string, number>()
    const sorted = [...matches].sort((a, b) => {
      const ta = a.time ? new Date(a.time).getTime() : 0
      const tb = b.time ? new Date(b.time).getTime() : 0
      return ta - tb || a.id.localeCompare(b.id)
    })
    sorted.forEach((m, i) => map.set(m.id, i + 1))
    return map
  }, [matches])

  if (matches.length === 0) return null

  const maxRound = Math.max(...matches.map((m) => m.round))
  const rounds: TournamentMatchView[][] = Array.from({ length: maxRound + 1 }, (_, r) =>
    matches.filter((m) => m.round === r),
  )

  // トーナメント全体で1つでも試合が始まっていたらドラッグ不可
  const anyMatchStarted = matches.some((m) => m.status === 'ONGOING' || m.status === 'FINISHED')

  const { matchCenterY, totalHeight } = computeLayout(matches, bracketType)
  const totalWidth = (maxRound + 1) * (MATCH_W + H_GAP) - H_GAP

  // ── SVG connector paths ───────────────────────────────
  // 通常パスと勝者ハイライトパスを分ける。
  // 勝者が決まった試合→次の試合への線は太く色を濃くして「進出」を表現する。
  type PathEntry = { d: string; highlighted: boolean }
  const pathEntries: PathEntry[] = []

  // matchId → そのmatchの勝者teamId / ラウンド
  const matchWinnerMap = new Map<string, string | null>()
  const matchRoundMap = new Map<string, number>()
  for (const m of matches) {
    matchWinnerMap.set(m.id, m.winnerTeamId ?? null)
    matchRoundMap.set(m.id, m.round)
  }

  for (let r = 1; r <= maxRound; r++) {
    const leftX = colX(r)

    for (const match of rounds[r]) {
      const parentY = matchCenterY.get(match.id) ?? 0
      const f1Y = match.slot1.sourceMatchId ? (matchCenterY.get(match.slot1.sourceMatchId) ?? null) : null
      const f2Y = match.slot2.sourceMatchId ? (matchCenterY.get(match.slot2.sourceMatchId) ?? null) : null

      // フィーダーのX座標を計算。
      // 非隣接ラウンド（all-play fold等でラウンドを飛び越えるフィーダー）は
      // 直前ラウンド列の右端を起点にして、長い水平線が中間列を横断するのを防ぐ。
      const prevColRightX = colX(r - 1) + MATCH_W
      const f1Round = match.slot1.sourceMatchId ? matchRoundMap.get(match.slot1.sourceMatchId) : undefined
      const f2Round = match.slot2.sourceMatchId ? matchRoundMap.get(match.slot2.sourceMatchId) : undefined
      const f1RightX = f1Round != null ? Math.max(colX(f1Round) + MATCH_W, prevColRightX) : prevColRightX
      const f2RightX = f2Round != null ? Math.max(colX(f2Round) + MATCH_W, prevColRightX) : prevColRightX

      // フィーダー試合の勝者が決まっている場合、その線をハイライト
      const f1Winner = match.slot1.sourceMatchId ? matchWinnerMap.get(match.slot1.sourceMatchId) : null
      const f2Winner = match.slot2.sourceMatchId ? matchWinnerMap.get(match.slot2.sourceMatchId) : null
      const f1Highlighted = !!(f1Winner && match.slot1.teamId && f1Winner === match.slot1.teamId)
      const f2Highlighted = !!(f2Winner && match.slot2.teamId && f2Winner === match.slot2.teamId)

      // 非隣接ラウンドのフィーダー→直前列右端までウォークオーバー線を描画
      const f1ActualRightX = f1Round != null ? colX(f1Round) + MATCH_W : prevColRightX
      const f2ActualRightX = f2Round != null ? colX(f2Round) + MATCH_W : prevColRightX
      if (f1Y != null && f1ActualRightX < prevColRightX) {
        pathEntries.push({ d: `M ${f1ActualRightX} ${f1Y} L ${prevColRightX} ${f1Y}`, highlighted: f1Highlighted })
      }
      if (f2Y != null && f2ActualRightX < prevColRightX) {
        pathEntries.push({ d: `M ${f2ActualRightX} ${f2Y} L ${prevColRightX} ${f2Y}`, highlighted: f2Highlighted })
      }

      if (f1Y != null && f2Y != null) {
        const midX = leftX - H_GAP / 2
        const topY = Math.min(f1Y, f2Y)
        const botY = Math.max(f1Y, f2Y)
        // フィーダー1→中間
        pathEntries.push({ d: `M ${f1RightX} ${f1Y} L ${midX} ${f1Y}`, highlighted: f1Highlighted })
        // フィーダー2→中間
        pathEntries.push({ d: `M ${f2RightX} ${f2Y} L ${midX} ${f2Y}`, highlighted: f2Highlighted })
        // 縦線（どちらかハイライトなら部分ハイライト：勝者側→中央だけ）
        if (f1Highlighted && !f2Highlighted) {
          pathEntries.push({ d: `M ${midX} ${f1Y} L ${midX} ${parentY}`, highlighted: true })
          pathEntries.push({ d: `M ${midX} ${parentY} L ${midX} ${f2Y}`, highlighted: false })
        } else if (f2Highlighted && !f1Highlighted) {
          pathEntries.push({ d: `M ${midX} ${f2Y} L ${midX} ${parentY}`, highlighted: true })
          pathEntries.push({ d: `M ${midX} ${parentY} L ${midX} ${f1Y}`, highlighted: false })
        } else {
          pathEntries.push({ d: `M ${midX} ${topY} L ${midX} ${botY}`, highlighted: f1Highlighted && f2Highlighted })
        }
        // 中間→次の試合
        pathEntries.push({ d: `M ${midX} ${parentY} L ${leftX} ${parentY}`, highlighted: f1Highlighted || f2Highlighted })
      } else if (f1Y != null || f2Y != null) {
        // 片方のフィーダーのみ存在する場合: L字コネクタで正しく接続
        const feederY = f1Y ?? f2Y!
        const feederRightX = f1Y != null ? f1RightX : f2RightX
        const isHighlighted = (f1Y != null && f1Highlighted) || (f2Y != null && f2Highlighted)
        const midX = leftX - H_GAP / 2
        // フィーダーから中間点へ水平線
        pathEntries.push({ d: `M ${feederRightX} ${feederY} L ${midX} ${feederY}`, highlighted: isHighlighted })
        // フィーダーY と parentY が異なる場合は垂直線で接続
        if (Math.abs(feederY - parentY) > 1) {
          pathEntries.push({ d: `M ${midX} ${feederY} L ${midX} ${parentY}`, highlighted: isHighlighted })
        }
        // 中間点から次の試合へ水平線
        pathEntries.push({ d: `M ${midX} ${parentY} L ${leftX} ${parentY}`, highlighted: isHighlighted })
      }
      // 両スロットがSEED（フィーダー試合なし）の場合は左側の線を描画しない
    }
  }

  return (
    <Box sx={{ overflowX: 'auto', overflowY: 'visible', pb: 1 }}>
      {/* Round labels */}
      {bracketType === 'MAIN' && (
        <Box sx={{ display: 'flex', width: totalWidth, mb: 1 }}>
          {rounds.map((_, r) => (
            <Box key={r} sx={{
              width: MATCH_W, ml: r > 0 ? `${H_GAP}px` : 0,
              flexShrink: 0, display: 'flex', justifyContent: 'center',
            }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', height: ROUND_LABEL_H,
                backgroundColor: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(63,81,181,0.2)',
                borderRadius: 1, px: 1.5, py: 0.25,
              }}>
                <Typography sx={{ fontSize: '11px', color: C.roundLabel, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {getRoundLabel(r, maxRound, rounds[r].length)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Bracket area */}
      <Box sx={{ position: 'relative', width: totalWidth, height: totalHeight, flexShrink: 0 }}>
        {/* SVG connectors */}
        {maxRound > 0 && (
          <svg
            width={totalWidth}
            height={totalHeight}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          >
            {/* 通常パス（下層） */}
            {pathEntries.filter(p => !p.highlighted).map((p, i) => (
              <path key={`n${i}`} d={p.d} stroke={C.connector} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.4} />
            ))}
            {/* 勝者ハイライトパス（上層） */}
            {pathEntries.filter(p => p.highlighted).map((p, i) => (
              <path key={`h${i}`} d={p.d} stroke={C.winnerAccent} strokeWidth={3} fill="none" strokeLinecap="round" />
            ))}
          </svg>
        )}

        {/* Match cards */}
        {rounds.map((roundMatches, r) =>
          roundMatches.map((match) => {
            const centerY = matchCenterY.get(match.id) ?? 0
            const canDrag = !!onSwapMatches && !anyMatchStarted
            return (
              <Box
                key={match.id}
                sx={{
                  position: 'absolute',
                  left: colX(r),
                  top: centerY - MATCH_H / 2,
                  width: MATCH_W,
                  zIndex: 1,
                }}
              >
                <MatchCard
                  match={match}
                  orderNumber={matchOrderMap.get(match.id)}
                  onClick={onMatchClick}
                  onSeedClick={onSeedClick}
                  draggable={canDrag}
                  isDragOver={dragOverMatchId === match.id}
                  onDragStart={canDrag ? (e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ matchId: match.id, round: match.round }))
                    e.dataTransfer.effectAllowed = 'move'
                  } : undefined}
                  onDragOver={canDrag ? (e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    setDragOverMatchId(match.id)
                  } : undefined}
                  onDragEnd={() => setDragOverMatchId(null)}
                  onDrop={canDrag ? (e) => {
                    e.preventDefault()
                    setDragOverMatchId(null)
                    try {
                      const d = JSON.parse(e.dataTransfer.getData('application/json'))
                      if (d.matchId !== match.id && d.round === match.round) {
                        const sourceMatch = matches.find(m => m.id === d.matchId)
                        if (sourceMatch && sourceMatch.status === 'STANDBY') {
                          onSwapMatches?.(sourceMatch, match)
                        }
                      }
                    } catch { /* ignore */ }
                  } : undefined}
                />
              </Box>
            )
          })
        )}
      </Box>
    </Box>
  )
}

// ─── Public component ────────────────────────────────────

type Props = {
  bracket: BracketView
  onMatchClick?: (match: TournamentMatchView) => void
  onSeedClick?: (seedNumber: number, currentTeamId: string | null | undefined, anchorEl: HTMLElement, bracketId: string, slotId: string | undefined) => void
  onSwapMatches?: (matchA: TournamentMatchView, matchB: TournamentMatchView, bracketId: string) => void
}

export function TournamentBracketView({ bracket, onMatchClick, onSeedClick, onSwapMatches }: Props) {
  // bracketId を各コールバックに付与するラッパー
  const handleSeedClick = onSeedClick
    ? (seedNumber: number, currentTeamId: string | null | undefined, anchorEl: HTMLElement, slotId: string | undefined) =>
        onSeedClick(seedNumber, currentTeamId, anchorEl, bracket.id, slotId)
    : undefined

  const handleSwapMatches = onSwapMatches
    ? (matchA: TournamentMatchView, matchB: TournamentMatchView) =>
        onSwapMatches(matchA, matchB, bracket.id)
    : undefined
  const isMain = bracket.bracketType === 'MAIN'
  const accentColor = isMain ? C.mainAccent : C.subAccent
  const status = getBracketStatus(bracket)
  const { finished, total } = getProgress(bracket.matches)
  const progressPct = total > 0 ? Math.round((finished / total) * 100) : 0

  return (
    <Box sx={{ borderLeft: `4px solid ${accentColor}`, pl: 2, pt: 0.5, pb: 0 }}>
      {/* ブラケットヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75, flexWrap: 'wrap' }}>
        {isMain
          ? <EmojiEventsIcon sx={{ fontSize: 18, color: accentColor }} />
          : <AccountTreeIcon sx={{ fontSize: 18, color: accentColor }} />
        }
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#2F3C8C' }}>
          {bracket.name}
        </Typography>
        <Chip label={status.label} size="small"
          sx={{ bgcolor: status.bg, color: status.color, fontSize: '11px', height: 20, fontWeight: 600 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <Typography sx={{ fontSize: '11px', color: '#5B6DC6', whiteSpace: 'nowrap' }}>
            進捗 {finished}/{total}
          </Typography>
          <Box sx={{ width: 80 }}>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 6, borderRadius: 3,
                backgroundColor: 'rgba(91,109,198,0.2)',
                '& .MuiLinearProgress-bar': { backgroundColor: accentColor, borderRadius: 3 },
              }}
            />
          </Box>
          <Typography sx={{ fontSize: '11px', color: accentColor, fontWeight: 700, minWidth: 32 }}>
            {progressPct}%
          </Typography>
        </Box>
      </Box>

      {/* ブラケット本体 */}
      <BracketTree matches={bracket.matches} bracketType={bracket.bracketType} onMatchClick={onMatchClick} onSeedClick={handleSeedClick} onSwapMatches={handleSwapMatches} />
    </Box>
  )
}
