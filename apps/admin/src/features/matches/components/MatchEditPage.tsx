import { useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import type { ActiveMatch, ActiveTeam } from '../types'
import { MOCK_ACTIVE_LEAGUES } from '../mock'
import type { WinnerType, MatchStatusType } from '../hooks/useMatchEdit'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

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

type ToastType = 'saved' | 'reverted' | null

type Props = {
  match: ActiveMatch
  teamA: ActiveTeam
  teamB: ActiveTeam
  leagueName: string
  competitionName: string
  scoreA: string
  scoreB: string
  winner: WinnerType
  matchStatus: MatchStatusType
  onScoreAChange: (v: string) => void
  onScoreBChange: (v: string) => void
  onWinnerChange: (v: WinnerType) => void
  onMatchStatusChange: (v: MatchStatusType) => void
  onBack: () => void
  onBackToList: () => void
  onBackToCompetition: () => void
  onReset: () => void
  onSave: () => void
}

export function MatchEditPage({
  match,
  teamA,
  teamB,
  leagueName,
  competitionName,
  scoreA,
  scoreB,
  winner,
  matchStatus,
  onScoreAChange,
  onScoreBChange,
  onWinnerChange,
  onMatchStatusChange,
  onBack,
  onBackToList,
  onBackToCompetition,
  onReset,
}: Props) {
  const [toast, setToast] = useState<ToastType>(null)

  const handleSave = () => {
    setToast('saved')
  }

  const handleReset = () => {
    onReset()
    setToast('reverted')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* パンくず */}
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToList}
        >
          試合
        </Typography>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToCompetition}
        >
          {competitionName}
        </Typography>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBack}
        >
          {leagueName}(ID:1)
        </Typography>
        <Typography sx={{ fontSize: '16px', color: '#2F3C8C' }}>
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
                  <Box
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
                  </Box>
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
                  <Box
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
                  </Box>
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
      <DetailsCard match={match} />

      {/* ─── トースト通知 ─── */}
      {toast && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#52598D',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 2000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            minWidth: 300,
          }}
        >
          {/* テキスト */}
          <Typography sx={{ fontSize: '13px', color: '#fff', fontWeight: 500, flex: 1 }}>
            {toast === 'saved' ? '変更が保存されました' : '変更を元に戻しました'}
          </Typography>

          {/* リーグに戻るボタン */}
          <Button
            size="small"
            onClick={onBack}
            sx={{
              fontSize: '12px',
              color: '#fff',
              backgroundColor: '#5F6DC2',
              whiteSpace: 'nowrap',
              px: 1.5,
              flexShrink: 0,
              '&:hover': { backgroundColor: '#4F5DB2' },
            }}
          >
            リーグに戻る
          </Button>

          {/* × ボタン */}
          <IconButton
            size="small"
            onClick={() => setToast(null)}
            sx={{
              color: '#fff',
              flexShrink: 0,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

// ─── カード2: 試合の詳細設定（アコーディオン） ────────────────
const DETAIL_FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
  },
  '& input, & textarea': { fontSize: '13px', color: '#2F3C8C' },
}

const DETAIL_LABEL_SX = { fontSize: '12px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }

function DetailsCard({ match }: { match: ActiveMatch }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(match.note ?? '')
  const [referee, setReferee] = useState(match.referee ?? '')
  const [location, setLocation] = useState(match.location ?? '1')
  const [startTime, setStartTime] = useState(match.startTime ?? '2026-03-25T22:48')

  const handleSave = () => {
    for (const leagues of Object.values(MOCK_ACTIVE_LEAGUES)) {
      for (const league of leagues) {
        const m = league.matches.find((m) => m.id === match.id)
        if (m) {
          m.note = note
          m.referee = referee
          m.location = location
          m.startTime = startTime
        }
      }
    }
    setOpen(false)
  }

  return (
    <Card sx={{ background: CARD_GRADIENT }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
            試合の詳細設定
          </Typography>
          {open && (
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#5B6DC6', '&:hover': { backgroundColor: '#E8EAF6' } }}>
              <ExpandLessIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>

        {/* 編集するトグル（未展開時のみボタン表示） */}
        {!open ? (
          <Box
            onClick={() => setOpen(true)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid #5B6DC6', borderRadius: 1, px: 1.5, py: 0.75,
              cursor: 'pointer', backgroundColor: 'transparent',
              '&:hover': { backgroundColor: '#E8EAF6' },
            }}
          >
            <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 500 }}>
              編集する
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C' }}>
            編集する
          </Typography>
        )}

        {/* 展開コンテンツ */}
        <Collapse in={open} timeout={300}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* 補足 */}
            <Box>
              <Typography sx={DETAIL_LABEL_SX}>補足</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="補足情報を入力してください(任意)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{
                  ...DETAIL_FIELD_SX,
                  '& .MuiInputBase-input::placeholder': { color: '#2F3C8C', opacity: 0.6 },
                }}
              />
            </Box>

            {/* 審判 */}
            <Box>
              <Typography sx={DETAIL_LABEL_SX}>審判</Typography>
              <Select
                value={referee}
                displayEmpty
                size="small"
                fullWidth
                onChange={(e) => setReferee(e.target.value)}
                renderValue={(val) => (
                  <Typography sx={{ fontSize: '13px', color: val ? '#2F3C8C' : '#9e9e9e' }}>
                    {val || '審判'}
                  </Typography>
                )}
                sx={{
                  backgroundColor: 'transparent',
                  '& fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
                  '&:hover fieldset': { borderColor: '#5B6DC6' },
                  '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
                }}
              >
                <MenuItem value=""><Typography sx={{ fontSize: '13px', color: '#9e9e9e' }}>審判</Typography></MenuItem>
                <MenuItem value="r1"><Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>審判員 A</Typography></MenuItem>
                <MenuItem value="r2"><Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>審判員 B</Typography></MenuItem>
              </Select>
            </Box>

            {/* 試合の場所 */}
            <Box>
              <Typography sx={{ ...DETAIL_LABEL_SX, mb: 1.5 }}>試合の場所</Typography>
              <FormControl size="small" fullWidth>
                <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>場所</InputLabel>
                <Select
                  value={location}
                  label="場所"
                  notched
                  size="small"
                  fullWidth
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{
                    backgroundColor: 'transparent',
                    '& fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
                    '&:hover fieldset': { borderColor: '#5B6DC6' },
                    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
                  }}
                >
                  <MenuItem value="1"><Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>1 - Soccer Field 1</Typography></MenuItem>
                  <MenuItem value="2"><Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>2 - Soccer Field 2</Typography></MenuItem>
                  <MenuItem value="3"><Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>3 - 体育館</Typography></MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* 開始時刻 */}
            <TextField
              label="開始時刻"
              type="datetime-local"
              size="small"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{
                ...DETAIL_FIELD_SX,
                '& .MuiInputLabel-root': { color: '#2F3C8C', fontSize: '13px' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C' },
              }}
              InputLabelProps={{ shrink: true }}
            />

            {/* すべて元に戻す / 実行 */}
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon sx={{ color: '#D71212' }} />}
                onClick={() => {
                  setNote(match.note ?? '')
                  setReferee(match.referee ?? '')
                  setLocation(match.location ?? '1')
                  setStartTime(match.startTime ?? '2026-03-25T22:48')
                }}
                sx={{
                  flex: 3,
                  fontSize: '13px',
                  color: '#D71212',
                  borderColor: '#D71212',
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
                }}
              >
                すべて元に戻す
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleSave}
                sx={{ ...SAVE_BUTTON_SX, flex: 7, fontSize: '13px' }}
              >
                実行
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
