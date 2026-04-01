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
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import { navigateToPage } from '@/hooks/useAppNavigation'
import { useLeagueDetail } from '../hooks/useLeagueDetail'
import { ScoringDnDList } from './ScoringDnDList'
import { ProgressionRulesEditor } from './ProgressionRulesEditor'
import { AddEntryDialog } from './AddEntryDialog'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_TABLE_HEAD_SX, CARD_TABLE_CELL_SX, CARD_GRADIENT, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX } from '@/styles/commonSx'
import { TAG_OPTIONS } from '../constants'

const MATCH_FORMAT_OPTIONS = [
  { value: 'sunny', label: '晴天時' },
  { value: 'rainy', label: '雨天時' },
  { value: 'round_robin', label: 'ラウンドロビン' },
  { value: 'league', label: 'リーグ' },
  { value: 'tournament', label: 'トーナメント' },
  { value: 'group', label: 'グループステージ' },
]

const RESULT_JUDGMENT_OPTIONS = [
  { value: 'score', label: '得点制' },
  { value: 'win_loss', label: '勝敗制' },
  { value: 'time', label: '時間制' },
]

type Props = {
  leagueId: string
  leagueName: string
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
}

export function LeagueDetailPage({ leagueId, leagueName, competitionId, competitionName, onBackToList, onBackToDetail }: Props) {
  const {
    form,
    entries,
    addDialogOpen,
    progressionEnabled,
    progressionMaxRank,
    progressionRules,
    availableProgressionTargets,
    handleChange,
    handleScoringChange,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    setProgressionEnabled,
    setProgressionMaxRank,
    handleProgressionRuleChange,
  } = useLeagueDetail(leagueId, leagueName, competitionId)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <ButtonBase onClick={onBackToDetail} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {leagueName}
        </Typography>
      </Breadcrumbs>

      {/* 編集カード（自動保存） */}
      <Card sx={{ background: CARD_GRADIENT }}>
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
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="説明(任意)"
              value={form.description}
              onChange={handleChange('description')}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="重み(0〜100)*"
              type="number"
              value={form.weight}
              onChange={handleChange('weight')}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              sx={CARD_FIELD_SX}
            />
            <TextField
              select
              label="大会形式"
              value={form.matchFormat}
              onChange={handleChange('matchFormat')}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            >
              {MATCH_FORMAT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            <ScoringDnDList
              options={RESULT_JUDGMENT_OPTIONS}
              selected={form.resultJudgments}
              onChange={handleScoringChange}
            />

            <TextField
              select
              label="タグ"
              value={form.tag}
              onChange={handleChange('tag')}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            >
              {TAG_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <ProgressionRulesEditor
              enabled={progressionEnabled}
              maxRank={progressionMaxRank}
              rules={progressionRules}
              availableTargets={availableProgressionTargets}
              onEnabledChange={setProgressionEnabled}
              onMaxRankChange={setProgressionMaxRank}
              onRuleChange={handleProgressionRuleChange}
            />
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
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteEntry(entry.id)}
                      sx={DELETE_BUTTON_SX}
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
          {entries.length >= 2 && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<SportsScoreIcon />}
              onClick={() => navigateToPage('active-matches')}
              sx={{
                mt: 1.5,
                borderColor: '#5B6DC6',
                color: '#2F3C8C',
                fontSize: '14px',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#3949AB' },
                '& .MuiButton-startIcon': { color: '#5B6DC6' },
              }}
            >
              試合ページで確認する
            </Button>
          )}
        </CardContent>
      </Card>

      <AddEntryDialog
        open={addDialogOpen}
        leagueName={leagueName}
        competitionName={competitionName}
        existingTeamNames={entries.map(e => e.teamName)}
        onClose={handleCloseAddDialog}
        onAdd={handleAddEntries}
      />
    </Box>
  )
}
