import { useState, useMemo } from 'react'
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
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import type { ActiveMatch, ActiveTeam } from '../types'
import type { WinnerType, MatchStatusType } from '../hooks/useMatchEdit'
import { useGetAdminMatchQuery } from '@/gql/__generated__/graphql'
import { MatchDetailsCard } from './MatchDetailsCard'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'
import { BackButton } from '@/components/ui/BackButton'
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
  competitionType?: string
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

  const [detailOpen, setDetailOpen] = useState(false)

  // 最新の試合データを取得（情報タグ表示用）
  const { data: matchData } = useGetAdminMatchQuery({
    variables: { id: match.id },
    fetchPolicy: 'cache-and-network',
  })
  const matchDetail = matchData?.match

  const infoTags = useMemo(() => {
    const judgmentLabel = matchDetail?.judgment?.team?.name
      ?? matchDetail?.judgment?.group?.name
      ?? matchDetail?.judgment?.name
      ?? '未登録'
    const locationLabel = matchDetail?.location?.name ?? '未設定'
    const timeLabel = matchDetail?.time ? formatMatchTime(matchDetail.time) : '未設定'
    return { judgmentLabel, locationLabel, timeLabel }
  }, [matchDetail])

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
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <ButtonBase onClick={onBackToCompetition} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          {leagueName}
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          試合
        </Typography>
      </Breadcrumbs>

      {/* タイトル + 編集ボタン */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C' }}>
          {teamA.shortName} vs {teamB.shortName}
        </Typography>
        <Button
          variant={detailOpen ? 'contained' : 'outlined'}
          size="small"
          startIcon={detailOpen
            ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
            : <EditIcon sx={{ fontSize: 16 }} />
          }
          onClick={() => setDetailOpen(!detailOpen)}
          sx={detailOpen ? {
            backgroundColor: '#3949AB',
            color: '#fff',
            borderRadius: '20px',
            height: '33px',
            px: 2,
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(57, 73, 171, 0.3)',
            '&:hover': { backgroundColor: '#2F3C8C', boxShadow: '0 2px 12px rgba(57, 73, 171, 0.4)' },
          } : {
            color: '#4A5ABB',
            border: 'none',
            borderRadius: '20px',
            height: '33px',
            px: 2,
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: '#E8EAF6',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#DCE0F5' },
          }}
        >
          {detailOpen ? '閉じる' : '詳細設定'}
        </Button>
      </Box>

      {/* 詳細設定（展開式） */}
      <MatchDetailsCard
        match={match}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        competitionId={context.leagueId}
        competitionType={context.competitionType}
      />

      {/* ─── 試合結果の登録（常時展開） ─── */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#2F3C8C' }}>
            試合結果の登録
          </Typography>

          <Box sx={{ backgroundColor: '#E1E4F6', borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 情報タグ行 */}
            <Box sx={{ pb: 1.5, borderBottom: '1px solid #5B6DC6' }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { label: '審判', value: infoTags.judgmentLabel },
                  { label: '試合場所', value: infoTags.locationLabel },
                  { label: '試合開始', value: infoTags.timeLabel },
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

            {/* スコア入力エリア */}
            <Box sx={{ pb: 1.5, borderBottom: '1px solid #5B6DC6' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                <Box sx={{ flex: 1, backgroundColor: '#D8DEEB', borderRadius: 1, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C', textAlign: 'center' }}>
                    {teamA.shortName}のスコア
                  </Typography>
                  <TextField
                    size="small"
                    value={scoreA}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === '' || (/^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= 999)) onScoreAChange(v)
                    }}
                    error={scoreA !== '' && (Number(scoreA) < 0 || !Number.isInteger(Number(scoreA)))}
                    inputProps={{ type: 'number', min: 0, step: 1, style: { textAlign: 'center', fontSize: '24px', fontWeight: 700 } }}
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
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === '' || (/^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= 999)) onScoreBChange(v)
                    }}
                    error={scoreB !== '' && (Number(scoreB) < 0 || !Number.isInteger(Number(scoreB)))}
                    inputProps={{ type: 'number', min: 0, step: 1, style: { textAlign: 'center', fontSize: '24px', fontWeight: 700 } }}
                    sx={SCORE_INPUT_SX('#DEDAEB')}
                  />
                </Box>
              </Box>
            </Box>

            {/* 勝ったのは / 試合の状態 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
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
                onClick={handleReset}
                sx={{
                  fontSize: '13px',
                  color: '#D71212',
                  borderColor: '#D71212',
                  backgroundColor: 'transparent',
                  whiteSpace: 'nowrap',
                  '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
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
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

function formatMatchTime(isoString: string): string {
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return isoString
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
