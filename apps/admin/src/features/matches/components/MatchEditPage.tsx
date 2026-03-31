import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckIcon from '@mui/icons-material/Check'
import type { ActiveMatch, ActiveTeam } from '../types'
import type { WinnerType, MatchStatusType } from '../hooks/useMatchEdit'
import { MatchDetailsCard } from './MatchDetailsCard'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'

// ─── 定数 ────────────────────────────────────────────────
const SCORE_INPUT_SX = (bg: string) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: bg,
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
  },
  '& input': { fontSize: '24px', fontWeight: 700, color: '#2F3C8C', textAlign: 'center' },
})

const TOGGLE_BTN_SX = (active: boolean, activeBg: string) => ({
  flex: 1,
  fontSize: '12px',
  fontWeight: active ? 700 : 500,
  color: '#2F3C8C',
  backgroundColor: active ? activeBg : 'transparent',
  border: '1px solid #5B6DC6',
  borderRadius: 1,
  px: 1,
  py: 0.5,
  textAlign: 'center' as const,
  cursor: 'pointer',
  userSelect: 'none' as const,
  '&:hover': { backgroundColor: active ? activeBg : '#E0E3F5' },
})

type MatchContext = {
  leagueId: string
  leagueName: string
  competitionName: string
}

type ScoreForm = {
  scoreA: string
  scoreB: string
  winner: WinnerType
  matchStatus: MatchStatusType
  onScoreAChange: (v: string) => void
  onScoreBChange: (v: string) => void
  onWinnerChange: (v: WinnerType) => void
  onMatchStatusChange: (v: MatchStatusType) => void
}

type NavHandlers = {
  onBack: () => void
  onBackToList: () => void
  onBackToCompetition: () => void
}

type Props = {
  match: ActiveMatch
  teamA: ActiveTeam
  teamB: ActiveTeam
  context: MatchContext
  form: ScoreForm
  nav: NavHandlers
  onReset: () => void
  onSave: () => void
}

export function MatchEditPage({ match, teamA, teamB, context, form, nav, onReset, onSave }: Props) {
  const { leagueName, competitionName } = context
  const { scoreA, scoreB, winner, matchStatus, onScoreAChange, onScoreBChange, onWinnerChange, onMatchStatusChange } = form
  const { onBack, onBackToList, onBackToCompetition } = nav

  const handleSave = () => {
    onSave()
    showToast('変更が保存されました')
  }

  const handleReset = () => {
    onReset()
    showToast('変更を元に戻しました')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* パンくず */}
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <ButtonBase onClick={onBackToCompetition} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          {leagueName}(ID:{context.leagueId})
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          試合(ID:{match.id})
        </Typography>
      </Breadcrumbs>

      {/* ─── カード1: スコア・勝者・状態 ─── */}
      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* タイトル（グラデーションカード内、E1E4F6の外） */}
          <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#2F3C8C' }}>
            試合 {teamA.shortName} vs {teamB.shortName}の結果を登録
          </Typography>

          {/* 内側カード（E1E4F6） */}
          <Box sx={{ backgroundColor: '#E1E4F6', borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 情報タグ行 + 下線 */}
          <Box sx={{ pb: 1.5, borderBottom: '1px solid #5B6DC6' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                { label: '審判', value: '未登録' },
                { label: '試合場所', value: 'Soccer Field 1' },
                { label: '試合開始', value: match.time ?? '未設定' },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4A5ABB' }} />
                  <Typography sx={{ fontSize: '12px', color: '#2F3C8C' }}>
                    {item.label}: {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* スコア入力エリア + 下線 */}
          <Box sx={{ pb: 1.5, borderBottom: '1px solid #5B6DC6' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
              <Box sx={{ flex: 1, backgroundColor: '#D8DEEB', borderRadius: 1, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C', textAlign: 'center' }}>
                  {teamA.shortName}のスコア
                </Typography>
                <TextField
                  size="small"
                  value={scoreA}
                  onChange={(e) => onScoreAChange(e.target.value)}
                  inputProps={{ type: 'number', min: 0, style: { textAlign: 'center', fontSize: '24px', fontWeight: 700 } }}
                  sx={SCORE_INPUT_SX('#D8DEEB')}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C' }}>VS</Typography>
              </Box>
              <Box sx={{ flex: 1, backgroundColor: '#DEDAEB', borderRadius: 1, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C', textAlign: 'center' }}>
                  {teamB.shortName}のスコア
                </Typography>
                <TextField
                  size="small"
                  value={scoreB}
                  onChange={(e) => onScoreBChange(e.target.value)}
                  inputProps={{ type: 'number', min: 0, style: { textAlign: 'center', fontSize: '24px', fontWeight: 700 } }}
                  sx={SCORE_INPUT_SX('#DEDAEB')}
                />
              </Box>
            </Box>
          </Box>

          {/* 勝ったのは / 試合の状態 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* 勝ったのは */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C', textAlign: 'center' }}>
                勝ったのは
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {([
                  { value: 'teamA' as WinnerType, label: teamA.shortName },
                  { value: 'draw' as WinnerType, label: '引き分け' },
                  { value: 'teamB' as WinnerType, label: teamB.shortName },
                ] as { value: WinnerType; label: string }[]).map((opt, i, arr) => (
                  <ButtonBase
                    key={opt.value}
                    onClick={() => onWinnerChange(winner === opt.value ? null : opt.value)}
                    sx={{
                      ...TOGGLE_BTN_SX(winner === opt.value, '#D6DBF2'),
                      py: 1,
                      borderRadius: i === 0 ? '4px 0 0 4px' : i === arr.length - 1 ? '0 4px 4px 0' : 0,
                      borderLeft: i === 0 ? '1px solid #5B6DC6' : 'none',
                    }}
                  >
                    {opt.label}
                  </ButtonBase>
                ))}
              </Box>
            </Box>

            {/* 試合の状態 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C', textAlign: 'center' }}>
                試合の状態
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {([
                  { value: 'cancelled' as MatchStatusType, label: '中止' },
                  { value: 'standby' as MatchStatusType, label: 'スタンバイ' },
                  { value: 'ongoing' as MatchStatusType, label: '進行中' },
                  { value: 'finished' as MatchStatusType, label: '完了' },
                ] as { value: MatchStatusType; label: string }[]).map((opt, i, arr) => (
                  <ButtonBase
                    key={opt.value}
                    onClick={() => onMatchStatusChange(matchStatus === opt.value ? null : opt.value)}
                    sx={{
                      ...TOGGLE_BTN_SX(matchStatus === opt.value, '#D3DCE7'),
                      py: 1,
                      borderRadius: i === 0 ? '4px 0 0 4px' : i === arr.length - 1 ? '0 4px 4px 0' : 0,
                      borderLeft: i === 0 ? '1px solid #5B6DC6' : 'none',
                    }}
                  >
                    {opt.label}
                  </ButtonBase>
                ))}
              </Box>
            </Box>
          </Box>

          {/* 元に戻す / 保存 */}
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ color: '#D71212' }} />}
              onClick={handleReset}
              sx={{
                fontSize: '13px',
                color: '#D71212',
                borderColor: '#5B6DC6',
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: '#FDECEA', borderColor: '#5B6DC6' },
              }}
            >
              元に戻す
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleSave}
              fullWidth
              sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
            >
              保存
            </Button>
          </Box>
          {/* 内側カード閉じ */}
          </Box>
        </CardContent>
      </Card>

      {/* ─── カード2: 試合の詳細設定 ─── */}
      <MatchDetailsCard match={match} />

    </Box>
  )
}

