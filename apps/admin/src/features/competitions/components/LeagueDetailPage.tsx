import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { navigateToPage } from '@/hooks/useAppNavigation'
import { useLeagueDetail } from '../hooks/useLeagueDetail'
import { useActiveMatchLeague } from '@/features/matches/hooks/useActiveMatchLeague'
import { ProgressionRulesEditor } from './ProgressionRulesEditor'
import { AddEntryDialog } from './AddEntryDialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SportSelect } from './SportSelect'
import { SceneSelect } from '@/components/ui/SceneSelect'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_TABLE_HEAD_SX, CARD_TABLE_CELL_SX, CARD_GRADIENT, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX } from '@/styles/commonSx'
import { DateTimeInput } from '@/components/ui/DateTimeInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { showToast } from '@/lib/toast'
import { BackButton } from '@/components/ui/BackButton'
import { QrPdfExportDialog } from './QrPdfExportDialog'

type Props = {
  leagueId: string
  leagueName: string
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
  onSaved?: (newName: string) => void
  onDeleted?: () => void
}

export function LeagueDetailPage({ leagueId, leagueName, competitionId, competitionName: _competitionName, onBackToList, onBackToDetail: _onBackToDetail, onSaved, onDeleted }: Props) {
  const {
    form,
    dirty,
    entries,
    sports,
    scenes,
    setSportId,
    setSceneId,
    addDialogOpen,
    progressionEnabled,
    progressionRankRange,
    progressionRules,
    availableProgressionTargets,
    defaultsForm,
    locations,
    setEditStartTime,
    setEditMatchDuration,
    setEditBreakDuration,
    setEditLocationId,
    handleChange,
    handleSave,
    handleDelete,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    setProgressionEnabled,
    setProgressionRankRange,
    handleProgressionRuleChange,
  } = useLeagueDetail(leagueId, leagueName, competitionId)

  const { league: leagueStandings, grid, statsMap, rankLabels, matchOrderMap } = useActiveMatchLeague(competitionId, leagueId)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryConfirmAction, setEntryConfirmAction] = useState<(() => Promise<void>) | null>(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useUnsavedWarning(dirty)

  const hasMatches = leagueStandings != null && leagueStandings.matches.length > 0
  const hasInProgressMatches = leagueStandings?.matches.some(m => m.status === 'ongoing' || m.status === 'finished') ?? false

  const onSave = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await handleSave()
      onSaved?.(form.name.trim())
      showToast('リーグを保存しました')
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  const onConfirmDelete = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setDeleteDialogOpen(false)
    try {
      await handleDelete()
      onDeleted?.()
      showToast('リーグを削除しました')
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BackButton onClick={onBackToList} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          大会
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {leagueName}
        </Typography>
      </Breadcrumbs>

      {/* 編集カード */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            リーグを編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="リーグ名*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={!form.name.trim() && dirty}
              helperText={!form.name.trim() && dirty ? 'この項目は必須です' : form.name.length >= 60 ? `${form.name.length}/64文字` : ''}
              sx={CARD_FIELD_SX}
              slotProps={{ htmlInput: { maxLength: 64 } }}
            />

            <SportSelect value={form.sportId || null} onChange={(id) => setSportId(id ?? '')} sports={sports} />

            <SceneSelect value={form.sceneId || null} onChange={(id) => setSceneId(id ?? '')} scenes={scenes} label="タグ" />

            <TextField
              label="デフォルト場所"
              select
              value={defaultsForm.locationId}
              onChange={(e) => setEditLocationId(e.target.value)}
              size="small"
              fullWidth
              sx={CARD_FIELD_SX}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value=""><Typography sx={{ fontSize: '14px', color: '#2F3C8C', opacity: 0.5 }}>未設定</Typography></MenuItem>
              {locations.map(loc => (
                <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
              ))}
            </TextField>

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
              試合時間設定
            </Typography>
            <DateTimeInput
              label="開始時刻"
              value={defaultsForm.startTime}
              onChange={(v) => setEditStartTime(v)}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <NumberInput
                label="試合時間（分）"
                value={defaultsForm.matchDuration}
                onChange={(v) => setEditMatchDuration(Math.max(1, v))}
                min={1}
                max={999}
                fullWidth
                sx={CARD_FIELD_SX}
              />
              <NumberInput
                label="休憩時間（分）"
                value={defaultsForm.breakDuration}
                onChange={(v) => setEditBreakDuration(Math.max(0, v))}
                min={0}
                max={999}
                fullWidth
                sx={CARD_FIELD_SX}
              />
            </Box>

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
              勝ち点設定
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <NumberInput
                label="勝ち"
                value={form.winPt}
                onChange={(v) => handleChange('winPt')({ target: { value: String(v) } } as React.ChangeEvent<HTMLInputElement>)}
                min={0}
                max={999}
                fullWidth
                error={Number(form.winPt) < 0 || !Number.isInteger(Number(form.winPt))}
                helperText={Number(form.winPt) < 0 ? '0以上の値を入力してください' : !Number.isInteger(Number(form.winPt)) ? '整数を入力してください' : ''}
                sx={CARD_FIELD_SX}
              />
              <NumberInput
                label="引き分け"
                value={form.drawPt}
                onChange={(v) => handleChange('drawPt')({ target: { value: String(v) } } as React.ChangeEvent<HTMLInputElement>)}
                min={0}
                max={999}
                fullWidth
                error={Number(form.drawPt) < 0 || !Number.isInteger(Number(form.drawPt))}
                helperText={Number(form.drawPt) < 0 ? '0以上の値を入力してください' : !Number.isInteger(Number(form.drawPt)) ? '整数を入力してください' : ''}
                sx={CARD_FIELD_SX}
              />
              <NumberInput
                label="負け"
                value={form.losePt}
                onChange={(v) => handleChange('losePt')({ target: { value: String(v) } } as React.ChangeEvent<HTMLInputElement>)}
                min={0}
                max={999}
                fullWidth
                error={Number(form.losePt) < 0 || !Number.isInteger(Number(form.losePt))}
                helperText={Number(form.losePt) < 0 ? '0以上の値を入力してください' : !Number.isInteger(Number(form.losePt)) ? '整数を入力してください' : ''}
                sx={CARD_FIELD_SX}
              />
            </Box>

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <ProgressionRulesEditor
              enabled={progressionEnabled}
              rankRange={progressionRankRange}
              rules={progressionRules}
              availableTargets={availableProgressionTargets}
              entryCount={entries.length}
              onEnabledChange={setProgressionEnabled}
              onRankRangeChange={setProgressionRankRange}
              onRuleChange={handleProgressionRuleChange}
            />

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<QrCode2Icon />}
                onClick={() => setQrDialogOpen(true)}
                sx={{ flexShrink: 0, fontSize: '13px', borderColor: '#5B6DC6', color: '#2F3C8C', borderRadius: 1, '&:hover': { borderColor: '#2F3C8C', backgroundColor: '#F0F1FA' } }}
              >
                審判QR
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0 }}
              >
                このリーグを削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                disabled={!dirty || !form.name.trim() || [form.winPt, form.drawPt, form.losePt].some(v => Number(v) < 0 || !Number.isInteger(Number(v))) || isSubmitting}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* リーグ表カード */}
      {leagueStandings && leagueStandings.matches.length > 0 && (
        <Card elevation={0} sx={{ background: CARD_GRADIENT, overflow: 'hidden' }}>
          <CardContent sx={{ pb: '12px !important', overflow: 'hidden' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 1.5 }}>
              {leagueName} リーグ表
            </Typography>
            <Box sx={{ overflowX: 'auto', mx: 0.5 }}>
              <Table size="small" sx={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#E1E4F6', fontWeight: 600, color: '#2F3C8C' }} />
                    {leagueStandings.teams.map((team) => (
                      <TableCell key={team.id} sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#E6E9F5', fontWeight: 600, color: '#2F3C8C' }}>
                        {team.shortName}
                      </TableCell>
                    ))}
                    {['勝ち点率', '総得点率', '順位'].map((header) => (
                      <TableCell key={header} sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#D5D9EF', fontWeight: 600, color: '#2F3C8C', whiteSpace: 'nowrap' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leagueStandings.teams.map((team, rowIdx) => {
                    const stats = statsMap.get(team.id) ?? { points: 0, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0, winRate: 0, totalGoalRate: 0 }
                    const rankLbl = rankLabels.get(team.id) ?? ''
                    return (
                      <TableRow key={team.id}>
                        <TableCell sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#E6E9F5', fontWeight: 600, color: '#2F3C8C' }}>
                          {team.shortName}
                        </TableCell>
                        {grid[rowIdx].map((cell, colIdx) => {
                          if (cell.type === 'diagonal') {
                            return <TableCell key={colIdx} sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#E1E4F6' }} />
                          }
                          const m = cell.match
                          let resultMark = ''
                          let resultColor = '#2F3C8C'
                          let scoreLine = ''
                          let statusText = ''

                          if (!m) {
                            statusText = '-'
                          } else if (m.status === 'finished') {
                            const isRowTeamA = m.teamAId === cell.rowTeam.id
                            const rowWon = (isRowTeamA && m.winner === 'teamA') || (!isRowTeamA && m.winner === 'teamB')
                            const isDraw = !m.winner || m.winner === 'draw'
                            if (isDraw) {
                              resultMark = '△'
                              resultColor = '#F9A825'
                            } else if (rowWon) {
                              resultMark = '○'
                              resultColor = '#2E7D32'
                            } else {
                              resultMark = '×'
                              resultColor = '#D71212'
                            }
                            scoreLine = `${cell.homeScore}-${cell.awayScore}`
                          } else if (m.status === 'ongoing') {
                            statusText = '進行中'
                            resultColor = '#F57C00'
                          } else if (m.status === 'cancelled') {
                            statusText = '中止'
                            resultColor = '#9E9E9E'
                          } else {
                            statusText = '待機'
                            resultColor = '#9E9E9E'
                          }

                          const orderNum = m ? matchOrderMap.get(m.id) : undefined

                          return (
                            <TableCell
                              key={colIdx}
                              onClick={() => m && navigateToPage('active-matches', { matchId: m.id, from: 'league', competitionId, competitionName: leagueName })}
                              sx={{
                                border: '1px solid #5B6DC6',
                                py: 1.5,
                                px: 1,
                                fontSize: '11px',
                                textAlign: 'center',
                                backgroundColor: '#E6E9F5',
                                position: 'relative',
                                ...(m ? { cursor: 'pointer', '&:hover': { backgroundColor: '#D6DBF2' } } : {}),
                              }}
                            >
                              {orderNum != null && (
                                <Typography sx={{ position: 'absolute', top: 2, left: 4, fontSize: '10px', fontWeight: 500, color: '#8890C4', lineHeight: 1 }}>
                                  #{orderNum}
                                </Typography>
                              )}
                              {resultMark ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: resultColor, lineHeight: 1 }}>
                                    {resultMark}
                                  </Typography>
                                  <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#2F3C8C', lineHeight: 1 }}>
                                    {scoreLine}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: resultColor, whiteSpace: 'nowrap' }}>
                                  {statusText}
                                </Typography>
                              )}
                            </TableCell>
                          )
                        })}
                        <TableCell sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#D5D9EF', color: '#2F3C8C', fontWeight: 500 }}>
                          {stats.winRate.toFixed(3)}
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#D5D9EF', color: '#2F3C8C', fontWeight: 500 }}>
                          {stats.totalGoalRate.toFixed(3)}
                        </TableCell>
                        <TableCell sx={{ border: '1px solid #5B6DC6', py: 2.7, px: 2.25, fontSize: '11px', textAlign: 'center', backgroundColor: '#D5D9EF', color: '#2F3C8C', fontWeight: 600, whiteSpace: 'nowrap' }}>
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
      )}

      {/* エントリーカード */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {leagueName}のエントリー
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {['チーム名', 'クラス', ''].map((header, i) => (
                  <TableCell key={i} sx={{ ...CARD_TABLE_HEAD_SX, ...(i === 2 ? { width: 48 } : {}) }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.teamName}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.teamClass}</TableCell>
                  <TableCell sx={{ ...CARD_TABLE_CELL_SX, width: 48, p: 0, textAlign: 'center' }}>
                    <DeleteIcon
                      onClick={() => {
                        if (hasMatches) {
                          setEntryConfirmAction(() => () => handleDeleteEntry(entry.id))
                        } else {
                          handleDeleteEntry(entry.id)
                        }
                      }}
                      sx={{ fontSize: 20, color: hasInProgressMatches ? '#ccc' : '#D71212', cursor: hasInProgressMatches ? 'not-allowed' : 'pointer', opacity: 0.7, '&:hover': { opacity: hasInProgressMatches ? 0.7 : 1 }, pointerEvents: hasInProgressMatches ? 'none' : 'auto' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              disabled={hasInProgressMatches}
              sx={SAVE_BUTTON_SX}
            >
              エントリーを追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      <AddEntryDialog
        open={addDialogOpen}
        leagueName={leagueName}
        sportId={form.sportId}
        existingTeamNames={entries.map(e => e.teamName)}
        onClose={handleCloseAddDialog}
        onAdd={(selectedIds) => {
          if (hasMatches) {
            handleCloseAddDialog()
            setEntryConfirmAction(() => () => handleAddEntries(selectedIds))
          } else {
            handleAddEntries(selectedIds)
          }
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="リーグを削除しますか？"
        description={`「${leagueName}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />

      <ConfirmDialog
        open={entryConfirmAction !== null}
        title="試合が再生成されます"
        description="エントリーを変更すると、既存の試合が全て削除され、総当たり戦が再生成されます。試合に設定した審判・場所などの情報はリセットされます。"
        onClose={() => setEntryConfirmAction(null)}
        onConfirm={async () => {
          const action = entryConfirmAction
          setEntryConfirmAction(null)
          await action?.()
        }}
      />

      <QrPdfExportDialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        competitionId={competitionId}
        competitionName={form.name || leagueName}
      />

    </Box>
  )
}
