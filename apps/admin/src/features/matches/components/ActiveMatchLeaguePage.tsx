import {
  Box,
  Breadcrumbs,
  ButtonBase,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useActiveMatchLeague, statusLabel } from '../hooks/useActiveMatchLeague'
import { useLeagueRegenerate } from '../hooks/useLeagueRegenerate'
import { useBulkEdit } from '../hooks/useBulkEdit'
import { useMatchEdit } from '../hooks/useMatchEdit'
import { LeagueRegenerateOverlay } from './LeagueRegenerateOverlay'
import { ActiveMatchBulkEditPage } from './ActiveMatchBulkEditPage'
import { MatchEditPage } from './MatchEditPage'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { BackButton } from '@/components/ui/BackButton'
import { showToast } from '@/lib/toast'
import { useExecuteProgression } from '../hooks/useExecuteProgression'
import { TiebreakCard } from './TiebreakCard'

// ─── 定数 ────────────────────────────────────────────────
const CELL_BORDER = '1px solid #5B6DC6'
const BASE_CELL_SX = {
  border: CELL_BORDER,
  py: 2.7,
  px: 2.25,
  fontSize: '11px',
  textAlign: 'center' as const,
}
const MATCH_CELL_BG = '#E6E9F5'
const DIAG_CELL_BG = '#E1E4F6'
const STAT_CELL_BG = '#D5D9EF'

const SMALL_BTN_SX = {
  fontSize: '12px',
  fontWeight: 500,
  px: 1.5,
  py: 0.4,
  minWidth: 'auto',
  lineHeight: 1.5,
  backgroundColor: '#EFF0F8',
  color: '#2F3C8C',
  '&.MuiButton-root': { border: 'none', outline: 'none' },
  '&:hover': { backgroundColor: '#E5E6F0' },
}

// ─── コンポーネント ──────────────────────────────────────
type Props = {
  competitionId: string
  competitionName: string
  leagueId: string
  leagueName: string
  onBackToList: () => void
  onBackToCompetition: () => void
}

export function ActiveMatchLeaguePage({
  competitionId,
  competitionName,
  leagueId,
  leagueName,
  onBackToList,
  onBackToCompetition,
}: Props) {
  const { league, grid, allFinished, statsMap, rankLabels, tiedGroups } = useActiveMatchLeague(competitionId, leagueId)
  const regen = useLeagueRegenerate(competitionId, leagueId)
  const bulkEdit = useBulkEdit(competitionId, leagueId)
  const matchEdit = useMatchEdit()
  const progression = useExecuteProgression()
  if (!league) {
    return (
      <Box>
        <BackButton onClick={onBackToList} />
        <Breadcrumbs separator="/" sx={{ mb: 2 }}>
          <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>試合</ButtonBase>
          <Typography sx={BREADCRUMB_CURRENT_SX}>{leagueName}</Typography>
        </Breadcrumbs>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.6, mt: 2 }}>
          試合データがまだありません。大会設定からリーグの試合を登録してください。
        </Typography>
      </Box>
    )
  }

  // 一括編集ページ表示中
  if (bulkEdit.isOpen) {
    return (
      <ActiveMatchBulkEditPage
        competitionName={competitionName}
        leagueId={leagueId}
        leagueName={leagueName}
        filterDate={bulkEdit.filterDate}
        filterLocation={bulkEdit.filterLocation}
        csvData={bulkEdit.csvData}
        onFilterDateChange={bulkEdit.setFilterDate}
        onFilterLocationChange={bulkEdit.setFilterLocation}
        parsedRows={bulkEdit.parsedRows}
        onCsvDataChange={bulkEdit.setCsvData}
        onBack={bulkEdit.close}
        onBackToList={() => { bulkEdit.close(); onBackToList() }}
        onBackToCompetition={() => { bulkEdit.close(); onBackToCompetition() }}
        onExecute={bulkEdit.execute}
      />
    )
  }

  // 再生成ページ表示中
  if (regen.isOpen) {
    return (
      <LeagueRegenerateOverlay
        competitionName={competitionName}
        leagueId={leagueId}
        leagueName={leagueName}
        selectedLocation={regen.selectedLocation}
        isConfirmOpen={regen.isConfirmOpen}
        onSelectLocation={regen.setSelectedLocation}
        onBackToList={() => { regen.closeOverlay(); onBackToList() }}
        onBackToCompetition={() => { regen.closeOverlay(); onBackToCompetition() }}
        onBackToLeague={regen.closeOverlay}
        onSave={regen.openConfirm}
        onConfirmClose={regen.closeConfirm}
        onConfirmSave={() => { regen.confirmSave(); showToast('リーグの試合を再生成しました') }}
      />
    )
  }

  const teamMap = new Map(league.teams.map((t) => [t.id, t]))

  // 試合編集ページ表示中
  if (matchEdit.selectedMatch) {
    const tA = teamMap.get(matchEdit.selectedMatch.teamAId)
    const tB = teamMap.get(matchEdit.selectedMatch.teamBId)
    if (tA && tB) {
      return (
        <MatchEditPage
          match={matchEdit.selectedMatch}
          teamA={tA}
          teamB={tB}
          context={{ leagueId, leagueName, competitionName }}
          form={{
            scoreA: matchEdit.scoreA,
            scoreB: matchEdit.scoreB,
            winner: matchEdit.winner,
            matchStatus: matchEdit.matchStatus,
            onScoreAChange: matchEdit.setScoreA,
            onScoreBChange: matchEdit.setScoreB,
            onWinnerChange: matchEdit.setWinner,
            onMatchStatusChange: matchEdit.setMatchStatus,
          }}
          nav={{
            onBack: matchEdit.closeMatch,
            onBackToList: () => { matchEdit.closeMatch(); onBackToList() },
            onBackToCompetition: () => { matchEdit.closeMatch(); onBackToCompetition() },
          }}
          onReset={matchEdit.resetMatch}
          onSave={matchEdit.saveMatch}
        />
      )
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* パンくず */}
      <BackButton onClick={onBackToList} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {leagueName}
        </Typography>
      </Breadcrumbs>

      {/* ─── タイブレークカード（全試合終了 & 同順位あり） ─── */}
      {allFinished && tiedGroups.length > 0 && (
        <TiebreakCard leagueId={leagueId} tiedGroups={tiedGroups} />
      )}

      {/* ─── リーグ表カード ─── */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT, overflow: 'hidden' }}>
        <CardContent sx={{ pb: '12px !important', overflow: 'hidden' }}>
          {/* タイトル + 試合を再生成 (インライン) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', whiteSpace: 'nowrap' }}>
              {leagueName} リーグ表
            </Typography>
            <Button variant="text" size="small" sx={SMALL_BTN_SX} onClick={regen.openOverlay}>
              試合を再生成
            </Button>
            {allFinished && (
              <Button
                variant="text"
                size="small"
                sx={SMALL_BTN_SX}
                disabled={progression.loading}
                onClick={async () => {
                  const count = await progression.execute(competitionId, leagueId)
                  if (count > 0) showToast(`${count}チームをトーナメントに進出させました`)
                  else showToast('進出ルールが未設定、または対象がありません')
                }}
              >
                {progression.loading ? '進出処理中...' : '進出を実行'}
              </Button>
            )}
          </Box>

          {/* 警告カード */}
          {!allFinished && (
            <Box sx={{ backgroundColor: '#FFF2F2', borderRadius: 1, px: 2, py: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <ErrorOutlineIcon sx={{ color: '#D71212', fontSize: '18px', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '12px', color: '#D71212' }}>
                まだ試合中です。すべての試合が終了後に結果を確認してください。
              </Typography>
            </Box>
          )}

          {/* グリッド表: 1.5倍サイズ・はみ出たらスクロール */}
          <Box sx={{ overflowX: 'auto', mx: 0.5 }}>
            <Table size="small" sx={{ borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 1350 }}>
              <TableHead>
                <TableRow>
                  {/* 左上空セル */}
                  <TableCell sx={{ ...BASE_CELL_SX, backgroundColor: DIAG_CELL_BG, fontWeight: 600, color: '#2F3C8C' }} />
                  {/* チーム列ヘッダー */}
                  {league.teams.map((team) => (
                    <TableCell key={team.id} sx={{ ...BASE_CELL_SX, backgroundColor: MATCH_CELL_BG, fontWeight: 600, color: '#2F3C8C' }}>
                      {team.shortName}
                    </TableCell>
                  ))}
                  {/* 統計列ヘッダー */}
                  {['勝ち点率', '総得点率', '順位'].map((header) => (
                    <TableCell key={header} sx={{ ...BASE_CELL_SX, backgroundColor: STAT_CELL_BG, fontWeight: 600, color: '#2F3C8C', whiteSpace: 'nowrap' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {league.teams.map((team, rowIdx) => {
                  const stats = statsMap.get(team.id) ?? { points: 0, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0, winRate: 0, totalGoalRate: 0 }
                  const rankLbl = rankLabels.get(team.id) ?? ''
                  return (
                    <TableRow key={team.id}>
                      {/* 行ヘッダー */}
                      <TableCell sx={{ ...BASE_CELL_SX, backgroundColor: MATCH_CELL_BG, fontWeight: 600, color: '#2F3C8C' }}>
                        {team.shortName}
                      </TableCell>
                      {/* マッチセル */}
                      {grid[rowIdx].map((cell, colIdx) => (
                        <TableCell key={colIdx} sx={{ ...BASE_CELL_SX, backgroundColor: cell.type === 'diagonal' ? DIAG_CELL_BG : MATCH_CELL_BG }}>
                          {cell.type === 'diagonal' ? null : (
                            <Typography sx={{ fontSize: '10px', color: '#2F3C8C', fontWeight: 500, whiteSpace: 'nowrap' }}>
                              {cell.rowTeam.shortName} vs {cell.colTeam.shortName}
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                      {/* 統計セル */}
                      <TableCell sx={{ ...BASE_CELL_SX, backgroundColor: STAT_CELL_BG, color: '#2F3C8C', fontWeight: 500 }}>
                        {stats.winRate.toFixed(3)}
                      </TableCell>
                      <TableCell sx={{ ...BASE_CELL_SX, backgroundColor: STAT_CELL_BG, color: '#2F3C8C', fontWeight: 500 }}>
                        {stats.totalGoalRate.toFixed(3)}
                      </TableCell>
                      <TableCell sx={{ ...BASE_CELL_SX, backgroundColor: STAT_CELL_BG, color: '#2F3C8C', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {rankLbl}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* ─── 試合一覧カード ─── */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ pb: '12px !important' }}>
          {/* タイトル + 一括編集 (インライン) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', whiteSpace: 'nowrap' }}>
              {leagueName} 試合一覧
            </Typography>
            <Button variant="text" size="small" sx={SMALL_BTN_SX} onClick={bulkEdit.open}>
              一括編集
            </Button>
          </Box>

          {/* 試合カード: 4列グリッド */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
            {league.matches.map((match) => {
              const teamA = teamMap.get(match.teamAId)
              const teamB = teamMap.get(match.teamBId)
              if (!teamA || !teamB) return null
              return (
                <Box
                  key={match.id}
                  onClick={() => matchEdit.openMatch(match)}
                  sx={{
                    backgroundColor: '#E6E9F5', borderRadius: 1, p: 1.25,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#DDE0F0' },
                  }}
                >
                  {/* アイコン + 時刻 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                    <LocationOnIcon sx={{ fontSize: 14, color: '#5F6DC2' }} />
                    <AccessTimeIcon sx={{ fontSize: 14, color: '#5F6DC2' }} />
                    <Typography sx={{ fontSize: '12px', color: '#2F3C8C', fontWeight: 500 }}>
                      {match.time ?? '未設定'}
                    </Typography>
                  </Box>

                  {/* C6CBECカード */}
                  <Box sx={{ backgroundColor: '#C6CBEC', borderRadius: 1, p: 0.75, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {/* リーグ名 + ステータス */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box sx={{ backgroundColor: '#E6E9F5', borderRadius: 0.5, px: 0.75, py: 0.25 }}>
                        <Typography sx={{ fontSize: '11px', color: '#2F3C8C', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {leagueName}
                        </Typography>
                      </Box>
                      <Box sx={{ backgroundColor: '#E6E9F5', borderRadius: 0.5, px: 0.75, py: 0.25 }}>
                        <Typography sx={{ fontSize: '11px', color: '#5F6DC2', whiteSpace: 'nowrap' }}>
                          {statusLabel(match.status)}
                        </Typography>
                      </Box>
                    </Box>
                    {/* チームマッチアップ */}
                    <Box sx={{ backgroundColor: '#E6E9F5', borderRadius: 0.5, px: 0.75, py: 0.25, alignSelf: 'flex-start' }}>
                      <Typography sx={{ fontSize: '11px', color: '#2F3C8C', fontWeight: 500 }}>
                        {teamA.shortName} vs {teamB.shortName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>

    </Box>
  )
}
