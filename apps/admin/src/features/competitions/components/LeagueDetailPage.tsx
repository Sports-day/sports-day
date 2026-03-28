import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import { useLeagueDetail } from '../hooks/useLeagueDetail'
import { AddEntryDialog } from './AddEntryDialog'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_TABLE_HEAD_SX, CARD_TABLE_CELL_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '../../../styles/commonSx'

const MATCH_FORMAT_OPTIONS = [
  { value: 'sunny', label: '晴天時' },
  { value: 'rainy', label: '雨天時' },
  { value: 'round_robin', label: 'ラウンドロビン' },
  { value: 'tournament', label: 'トーナメント' },
  { value: 'group', label: 'グループステージ' },
]

const RESULT_JUDGMENT_OPTIONS = [
  { value: 'score', label: '得点制' },
  { value: 'win_loss', label: '勝敗制' },
  { value: 'time', label: '時間制' },
]

const TAG_OPTIONS = [
  { value: 'sunny', label: '晴天時' },
  { value: 'rainy', label: '雨天時' },
  { value: 'indoor', label: '室内' },
  { value: 'outdoor', label: '屋外' },
]

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
  },
  '& .MuiInputBase-input': { color: '#2F3C8C', fontSize: '14px' },
  '& .MuiInputLabel-root': { color: '#2F3C8C', opacity: 0.7 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C', opacity: 1 },
  '& .MuiInputLabel-shrink': { opacity: 1 },
}

type Props = {
  leagueId: string
  leagueName: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
}

export function LeagueDetailPage({ leagueId, leagueName, competitionName, onBackToList, onBackToDetail }: Props) {
  const {
    form,
    entries,
    addDialogOpen,
    handleChange,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    handleSave,
  } = useLeagueDetail(leagueId, leagueName)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBackToList}>
          競技
        </Typography>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBackToDetail}>
          {competitionName}
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {leagueName}
        </Typography>
      </Breadcrumbs>

      {/* 編集カード */}
      <Card sx={{ background: CARD_GRADIENT, border: '1px solid #5B6DC6' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {leagueName}を編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="大会(トーナメント・リーグ)名*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />
            <TextField
              label="説明(任意)"
              value={form.description}
              onChange={handleChange('description')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />
            <TextField
              label="重み(0〜100)*"
              type="number"
              value={form.weight}
              onChange={handleChange('weight')}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              sx={FIELD_SX}
            />
            <TextField
              select
              label="大会形式"
              value={form.matchFormat}
              onChange={handleChange('matchFormat')}
              size="small"
              sx={{ ...FIELD_SX, width: { xs: '100%', sm: '33%' } }}
            >
              {MATCH_FORMAT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="採点方式"
              value={form.resultJudgment}
              onChange={handleChange('resultJudgment')}
              size="small"
              sx={{ ...FIELD_SX, width: { xs: '100%', sm: '33%' } }}
            >
              {RESULT_JUDGMENT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="タグ"
              value={form.tag}
              onChange={handleChange('tag')}
              size="small"
              sx={{ ...FIELD_SX, width: { xs: '100%', sm: '33%' } }}
            >
              {TAG_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckIcon />}
              onClick={handleSave}
              sx={{ ...SAVE_BUTTON_SX, mt: 1, '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
            >
              保存
            </Button>
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
                {['ID', 'チーム名', 'クラス', 'アクション'].map((header, i) => (
                  <TableCell key={i} sx={CARD_TABLE_HEAD_SX}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.id}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.teamName}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.teamClass}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleDeleteEntry(entry.id)}
                      sx={{
                        color: '#D71212',
                        backgroundColor: '#D9DCED',
                        '&.MuiButton-root': { border: 'none', outline: 'none' },
                        '&:hover': { backgroundColor: '#C8CAD9' },
                      }}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ ...SAVE_BUTTON_SX, mt: 2, '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
          >
            エントリーを追加
          </Button>
        </CardContent>
      </Card>

      <AddEntryDialog
        open={addDialogOpen}
        leagueName={leagueName}
        competitionName={competitionName}
        onClose={handleCloseAddDialog}
        onAdd={handleAddEntries}
      />
    </Box>
  )
}
