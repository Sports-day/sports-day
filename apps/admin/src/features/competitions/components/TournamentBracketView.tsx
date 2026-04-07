import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import type { BracketView, TournamentMatchView, TournamentSlotView } from '../types'

// ─── Layout constants ────────────────────────────────────
const MATCH_W = 224
const MATCH_H = 108    // card height (header ~36 + row1 36 + row2 36)
const H_GAP = 48       // horizontal gap between round columns
const V_GAP = 8        // vertical gap between matches in the same round
const SLOT_H = MATCH_H + V_GAP  // 116px — height of one original "seed pair" slot
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

function nextPow2(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}

function getSeedOrder(size: number): number[] {
  if (size === 2) return [1, 2]
  const prev = getSeedOrder(size / 2)
  return prev.flatMap((s) => [s, size + 1 - s])
}

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
 * After computing raw centre-Y values, shift them so the topmost card
 * starts at Y_PAD from the top and recalculate totalHeight to fit.
 */
function normalizePositions(
  matchCenterY: Map<string, number>,
): { matchCenterY: Map<string, number>; totalHeight: number } {
  if (matchCenterY.size === 0) return { matchCenterY, totalHeight: SLOT_H }

  const allY = Array.from(matchCenterY.values())
  const minCenter = Math.min(...allY)
  const maxCenter = Math.max(...allY)

  // Shift so the topmost card's top edge sits at Y_PAD
  const offset = minCenter - MATCH_H / 2 - Y_PAD
  for (const [k, v] of matchCenterY) {
    matchCenterY.set(k, v - offset)
  }
  const totalHeight = (maxCenter - offset) + MATCH_H / 2 + Y_PAD
  return { matchCenterY, totalHeight }
}

function computeLayout(
  matches: TournamentMatchView[],
  bracketType: BracketView['bracketType'],
): { matchCenterY: Map<string, number>; totalHeight: number } {
  if (matches.length === 0) return { matchCenterY: new Map(), totalHeight: SLOT_H }

  const maxRound = Math.max(...matches.map((m) => m.round))
  const rounds: TournamentMatchView[][] = Array.from({ length: maxRound + 1 }, (_, r) =>
    matches.filter((m) => m.round === r),
  )

  // ── MAIN bracket: seed-order-based positions ──────────
  if (bracketType === 'MAIN') {
    let maxSeed = 0
    for (const m of matches) {
      for (const slot of [m.slot1, m.slot2]) {
        if (slot.sourceType === 'SEED' && slot.seedNumber != null) {
          maxSeed = Math.max(maxSeed, slot.seedNumber)
        }
      }
    }

    if (maxSeed > 0) {
      const bracketSize = nextPow2(maxSeed)
      const order = getSeedOrder(bracketSize)
      const seedPos = new Map<number, number>()
      order.forEach((s, i) => seedPos.set(s, i))

      // Seed at position pos is in pair floor(pos/2) → center Y = (pair + 0.5) * SLOT_H
      const seedCenterY = (seedNumber: number) => {
        const pos = seedPos.get(seedNumber) ?? 0
        return (Math.floor(pos / 2) + 0.5) * SLOT_H
      }

      const matchCenterY = new Map<string, number>()
      for (let r = 0; r <= maxRound; r++) {
        for (const m of rounds[r]) {
          const y = (slot: TournamentSlotView): number => {
            if (slot.sourceType === 'SEED' && slot.seedNumber != null) return seedCenterY(slot.seedNumber)
            if (slot.sourceMatchId) return matchCenterY.get(slot.sourceMatchId) ?? 0
            return 0
          }
          const y1 = y(m.slot1)
          const y2 = y(m.slot2)
          // BYEがある場合（片方がSEED直進、もう片方が試合）→ 試合側のYに揃える
          const isByeSlot1 = m.slot1.sourceType === 'SEED' && !m.slot1.sourceMatchId && r > 0
          const isByeSlot2 = m.slot2.sourceType === 'SEED' && !m.slot2.sourceMatchId && r > 0
          const isMatchSlot1 = !!m.slot1.sourceMatchId
          const isMatchSlot2 = !!m.slot2.sourceMatchId
          if (isByeSlot1 && isMatchSlot2) {
            matchCenterY.set(m.id, y2)
          } else if (isByeSlot2 && isMatchSlot1) {
            matchCenterY.set(m.id, y1)
          } else {
            matchCenterY.set(m.id, (y1 + y2) / 2)
          }
        }
      }

      return normalizePositions(matchCenterY)
    }
  }

  // ── SUB bracket (or fallback): feeder-based positioning ──
  // Round 0 matches are stacked vertically.
  // Later rounds center on their feeder matches within this bracket.
  const matchCenterY = new Map<string, number>()

  // Place round 0
  rounds[0].forEach((m, i) => matchCenterY.set(m.id, i * SLOT_H + SLOT_H / 2))

  // Place subsequent rounds based on feeder positions
  for (let r = 1; r <= maxRound; r++) {
    for (const m of rounds[r]) {
      const feederYs: number[] = []
      for (const slot of [m.slot1, m.slot2]) {
        if (slot.sourceMatchId && matchCenterY.has(slot.sourceMatchId)) {
          feederYs.push(matchCenterY.get(slot.sourceMatchId)!)
        }
      }
      if (feederYs.length > 0) {
        // Center between feeder matches in this bracket
        matchCenterY.set(m.id, feederYs.reduce((a, b) => a + b, 0) / feederYs.length)
      } else {
        // No feeders in this bracket (e.g., MATCH_LOSER from main bracket) — stack
        const sh = SLOT_H * Math.pow(2, r)
        const idx = rounds[r].indexOf(m)
        matchCenterY.set(m.id, idx * sh + sh / 2)
      }
    }
  }
  return normalizePositions(matchCenterY)
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

function TeamRow({ label, score, isWinner, isBottom, empty }: {
  label: string; score: number | null | undefined
  isWinner: boolean; isBottom: boolean; empty: boolean
}) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', px: 1.5, minHeight: 36,
      borderTop: isBottom ? `1px solid rgba(63,81,181,0.12)` : 'none',
      backgroundColor: isWinner ? C.winnerBg : 'transparent',
      borderLeft: isWinner ? `3px solid ${C.winnerAccent}` : '3px solid transparent',
    }}>
      <Typography noWrap sx={{
        fontSize: '13px', flex: 1,
        color: empty ? C.emptySeed : (isWinner ? C.headerText : C.bodyText),
        fontWeight: isWinner ? 700 : 400,
        fontStyle: empty ? 'italic' : 'normal',
      }}>
        {label}
      </Typography>
      {empty ? (
        <Chip label="未割当" size="small" sx={{ height: 16, fontSize: '10px', bgcolor: '#ECEFF1', color: C.emptySeed, ml: 0.5 }} />
      ) : (
        <Typography sx={{
          fontSize: '14px', fontWeight: 700,
          color: isWinner ? C.winnerAccent : (score != null ? C.bodyText : C.dimText),
          minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
        }}>
          {score != null ? score : '−'}
        </Typography>
      )}
    </Box>
  )
}

// ─── MatchCard ───────────────────────────────────────────

function MatchCard({ match, onClick }: { match: TournamentMatchView; onClick?: (match: TournamentMatchView) => void }) {
  const { slot1, slot2, score1, score2, winnerTeamId, status } = match
  const win1 = !!(winnerTeamId && winnerTeamId === slot1.teamId)
  const win2 = !!(winnerTeamId && winnerTeamId === slot2.teamId)

  return (
    <Box
      onClick={onClick ? () => onClick(match) : undefined}
      sx={{
        width: MATCH_W, border: `1px solid ${C.border}`, borderRadius: 2,
        overflow: 'hidden', backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(63,81,181,0.10), 0 1px 2px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s',
        '&:hover': onClick ? { boxShadow: '0 4px 16px rgba(63,81,181,0.22)' } : {},
      }}
    >
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 1.5, py: 0.5, backgroundColor: C.header,
        borderBottom: `1px solid rgba(63,81,181,0.12)`, minHeight: 28,
      }}>
        <Typography sx={{ fontSize: '11px', color: C.headerText, fontWeight: 700, letterSpacing: 0.3 }}>
          {match.label ?? '試合'}
        </Typography>
        <StatusBadge status={status} />
      </Box>
      <TeamRow label={getSlotLabel(slot1)} score={score1} isWinner={win1} isBottom={false} empty={isEmptySeed(slot1)} />
      <TeamRow label={getSlotLabel(slot2)} score={score2} isWinner={win2} isBottom empty={isEmptySeed(slot2)} />
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

function BracketTree({ matches, bracketType, onMatchClick }: {
  matches: TournamentMatchView[]
  bracketType: BracketView['bracketType']
  onMatchClick?: (match: TournamentMatchView) => void
}) {
  if (matches.length === 0) return null

  const maxRound = Math.max(...matches.map((m) => m.round))
  const rounds: TournamentMatchView[][] = Array.from({ length: maxRound + 1 }, (_, r) =>
    matches.filter((m) => m.round === r),
  )

  const { matchCenterY, totalHeight } = computeLayout(matches, bracketType)
  const totalWidth = (maxRound + 1) * (MATCH_W + H_GAP) - H_GAP

  // ── SVG connector paths ───────────────────────────────
  // For each match at round r > 0, draw connectors from its feeder match(es).
  // SEED-fed slots (bye-advanced seeds) have no card in round r-1, so we
  // draw a one-sided "L" connector only from the actual match feeder.
  const paths: string[] = []
  for (let r = 1; r <= maxRound; r++) {
    const rightX = colX(r - 1) + MATCH_W
    const leftX = colX(r)

    for (const match of rounds[r]) {
      const parentY = matchCenterY.get(match.id) ?? 0
      const f1Y = match.slot1.sourceMatchId ? (matchCenterY.get(match.slot1.sourceMatchId) ?? null) : null
      const f2Y = match.slot2.sourceMatchId ? (matchCenterY.get(match.slot2.sourceMatchId) ?? null) : null

      if (f1Y != null && f2Y != null) {
        // 両フィーダーとも試合（偶数チームの通常ブラケット）→ 角型 H-V-H
        const midX = rightX + H_GAP / 2
        const topY = Math.min(f1Y, f2Y)
        const botY = Math.max(f1Y, f2Y)
        paths.push(`M ${rightX} ${f1Y} L ${midX} ${f1Y}`)
        paths.push(`M ${rightX} ${f2Y} L ${midX} ${f2Y}`)
        paths.push(`M ${midX} ${topY} L ${midX} ${botY}`)
        paths.push(`M ${midX} ${parentY} L ${leftX} ${parentY}`)
      } else if (f1Y != null || f2Y != null) {
        // 片方のみ試合（奇数チームのBYE直進） → 直線
        // parentY は layout 側で fY に揃えてあるので水平線になる
        paths.push(`M ${rightX} ${parentY} L ${leftX} ${parentY}`)
      }
      // 両フィーダーがシード直進 → コネクターなし
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
            {paths.map((d, i) => (
              <path key={i} d={d} stroke={C.connector} strokeWidth={2} fill="none" strokeLinecap="round" />
            ))}
          </svg>
        )}

        {/* Match cards */}
        {rounds.map((roundMatches, r) =>
          roundMatches.map((match) => {
            const centerY = matchCenterY.get(match.id) ?? 0
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
                <MatchCard match={match} onClick={onMatchClick} />
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
}

export function TournamentBracketView({ bracket, onMatchClick }: Props) {
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
        <Chip label={isMain ? '本戦' : '順位決定戦'} size="small"
          sx={{ bgcolor: accentColor, color: '#fff', fontSize: '10px', height: 20, fontWeight: 700 }} />
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
      <BracketTree matches={bracket.matches} bracketType={bracket.bracketType} onMatchClick={onMatchClick} />
    </Box>
  )
}
