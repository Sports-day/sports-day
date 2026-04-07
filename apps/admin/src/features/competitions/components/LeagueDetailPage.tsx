import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Divider,
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
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { navigateToPage } from '@/hooks/useAppNavigation'
import { useLeagueDetail } from '../hooks/useLeagueDetail'
import { ProgressionRulesEditor } from './ProgressionRulesEditor'
import { AddEntryDialog } from './AddEntryDialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SportSelect } from './SportSelect'
import { SceneSelect } from '@/components/ui/SceneSelect'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_TABLE_HEAD_SX, CARD_TABLE_CELL_SX, CARD_GRADIENT, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = async () => {
    try {
      await handleSave()
      onSaved?.(form.name.trim())
      showToast('リーグを保存しました')
    } catch (e) {
      console.error('保存エラー:', e)
      showToast('保存に失敗しました')
    }
  }

  const onConfirmDelete = async () => {
    setDeleteDialogOpen(false)
    await handleDelete()
    onDeleted?.()
    showToast('リーグを削除しました')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          大会
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {leagueName}
        </Typography>
      </Breadcrumbs>

      {/* 編集カード */}
      <Card sx={{ background: CARD_GRADIENT }}>
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
              sx={CARD_FIELD_SX}
            />

            <SportSelect value={form.sportId || null} onChange={(id) => setSportId(id ?? '')} sports={sports} />

            <SceneSelect value={form.sceneId || null} onChange={(id) => setSceneId(id ?? '')} scenes={scenes} label="タグ" />

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
              勝ち点設定
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="勝ち"
                type="number"
                value={form.winPt}
                onChange={handleChange('winPt')}
                size="small"
                slotProps={{ htmlInput: { min: 0 } }}
                sx={CARD_FIELD_SX}
              />
              <TextField
                label="引き分け"
                type="number"
                value={form.drawPt}
                onChange={handleChange('drawPt')}
                size="small"
                slotProps={{ htmlInput: { min: 0 } }}
                sx={CARD_FIELD_SX}
              />
              <TextField
                label="負け"
                type="number"
                value={form.losePt}
                onChange={handleChange('losePt')}
                size="small"
                slotProps={{ htmlInput: { min: 0 } }}
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
                disabled={!dirty || !form.name.trim()}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* エントリーカード */}
      <Card sx={{ background: CARD_GRADIENT }}>
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
                      onClick={() => handleDeleteEntry(entry.id)}
                      sx={{ fontSize: 20, color: '#D71212', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {entries.length >= 2 && (
              <Button
                variant="outlined"
                startIcon={<SportsScoreIcon />}
                onClick={() => navigateToPage('active-matches')}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0, borderColor: '#5B6DC6', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#3949AB' }, '& .MuiButton-startIcon': { color: '#5B6DC6' } }}
              >
                試合ページで確認する
              </Button>
            )}
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
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
        existingTeamNames={entries.map(e => e.teamName)}
        onClose={handleCloseAddDialog}
        onAdd={handleAddEntries}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="リーグを削除しますか？"
        description={`「${leagueName}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
