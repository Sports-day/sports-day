import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import {
  BREADCRUMB_LINK_SX,
  BREADCRUMB_CURRENT_SX,
  CARD_GRADIENT,
  CARD_FIELD_SX,
  ACTION_BUTTON_SX,
  DELETE_BUTTON_SX,
  SAVE_BUTTON_SX,
} from '@/styles/commonSx'
import { showToast } from '@/lib/toast'
import { ICON_OPTIONS, TAG_OPTIONS } from '../constants'
import { MOCK_LEAGUES_BY_COMPETITION, MOCK_TOURNAMENTS_BY_COMPETITION } from '../mock'
import { useCompetitionEdit } from '../hooks/useCompetitionEdit'

const ENTRY_BUTTON_SX = {
  backgroundColor: '#EFF0F8',
  width: '100%',
  height: 50,
  borderRadius: 1,
  justifyContent: 'flex-start',
  px: 2,
  fontSize: '16px',
  fontWeight: 400,
  color: '#2F3C8C',
  '&.MuiButton-root': { border: 'none', outline: 'none' },
  '&:hover': { backgroundColor: '#E5E6F0' },
}

type Props = {
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onNavigateToLeague: (leagueId: string, leagueName: string) => void
  onNavigateToTournament: (tournamentId: string, tournamentName: string) => void
  onNavigateToLeagueCreate: () => void
  onNavigateToTournamentCreate: () => void
  onSaved: (newName: string) => void
  onDeleted: () => void
}

export function CompetitionDetailPage({
  competitionId,
  competitionName,
  onBackToList,
  onNavigateToLeague,
  onNavigateToTournament,
  onNavigateToLeagueCreate,
  onNavigateToTournamentCreate,
  onSaved,
  onDeleted,
}: Props) {
  const leagues = MOCK_LEAGUES_BY_COMPETITION[competitionId] ?? []
  const tournaments = MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] ?? []
  const { form, handleChange, handleSave, handleDelete } = useCompetitionEdit(competitionId)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = () => {
    handleSave()
    setDirty(false)
    onSaved(form.name.trim())
    showToast('競技を保存しました')
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    onDeleted()
    showToast('競技を削除しました')
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {competitionName}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* 競技を編集カード */}
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600, mb: 2 }}>
              競技を編集
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onChangeCapture={() => setDirty(true)}>
              <TextField
                label="競技名*"
                value={form.name}
                onChange={handleChange('name')}
                fullWidth
                size="small"
                sx={CARD_FIELD_SX}
              />
              <TextField
                label="競技の説明"
                value={form.description}
                onChange={handleChange('description')}
                fullWidth
                size="small"
                sx={CARD_FIELD_SX}
              />
              <TextField
                select
                label="アイコン"
                value={form.icon}
                onChange={handleChange('icon')}
                fullWidth
                size="small"
                sx={CARD_FIELD_SX}
              >
                {ICON_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="タグ"
                value={form.tag}
                onChange={handleChange('tag')}
                fullWidth
                size="small"
                sx={CARD_FIELD_SX}
              >
                {TAG_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3 }} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={DELETE_BUTTON_SX}
                >
                  この競技を削除
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CheckIcon />}
                  onClick={onSave}
                  disabled={!form.name.trim()}
                  sx={{ ...SAVE_BUTTON_SX, '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
                >
                  保存
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* リーグ一覧 */}
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600 }}>
                リーグ一覧
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onNavigateToLeagueCreate}
                sx={ACTION_BUTTON_SX}
              >
                リーグを作成
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {leagues.map(league => (
                <Button key={league.id} variant="text" onClick={() => onNavigateToLeague(league.id, league.name)} sx={ENTRY_BUTTON_SX}>
                  {league.name}
                </Button>
              ))}
              {leagues.length === 0 && (
                <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5, gridColumn: '1 / -1', py: 1 }}>
                  リーグがありません
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* トーナメント一覧 */}
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600 }}>
                トーナメント一覧
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onNavigateToTournamentCreate}
                sx={ACTION_BUTTON_SX}
              >
                トーナメントを作成
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {tournaments.map(tournament => (
                <Button key={tournament.id} variant="text" onClick={() => onNavigateToTournament(tournament.id, tournament.name)} sx={ENTRY_BUTTON_SX}>
                  {tournament.name}
                </Button>
              ))}
              {tournaments.length === 0 && (
                <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5, gridColumn: '1 / -1', py: 1 }}>
                  トーナメントがありません
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="delete-dialog-title"
        PaperProps={{ sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          競技を削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            「{competitionName}」を削除します。この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontSize: '13px', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6' } }}
          >
            キャンセル
          </Button>
          <Button
            onClick={onConfirmDelete}
            variant="outlined"
            sx={{
              fontSize: '13px',
              color: '#D71212',
              borderColor: '#D71212',
              '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
