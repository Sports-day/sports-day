import { Box, Chip, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import type { MatchRow } from '../hooks/useActiveMatches'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  FINISHED: { bg: '#E8F5E9', color: '#2E7D32', label: '終了' },
  ONGOING: { bg: '#FFF3E0', color: '#E65100', label: '進行中' },
  STANDBY: { bg: '#E3F2FD', color: '#1565C0', label: 'スタンバイ' },
  CANCELED: { bg: '#F5F5F5', color: '#9E9E9E', label: '中止' },
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return `${(d.getMonth() + 1)}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  } catch {
    return iso
  }
}

type Props = {
  match: MatchRow
  onClick: () => void
}

export function MatchCard({ match, onClick }: Props) {
  const s = STATUS_STYLES[match.status] ?? STATUS_STYLES.STANDBY
  const isFinished = match.status === 'FINISHED'
  const teamA = match.teamAName || '—'
  const teamB = match.teamBName || '—'

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: '#EFF0F8',
        borderRadius: 1,
        p: 2,
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.15s',
        '&:hover': {
          backgroundColor: '#E5E6F0',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        minWidth: 0,
      }}
    >
      {/* ヘッダー: 競技 + 大会 + ステータス */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0, overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '11px', color: '#4A5ABB', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {match.sportName}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#888' }}>/</Typography>
          <Typography sx={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {match.competitionName}
          </Typography>
        </Box>
        <Chip
          label={s.label}
          size="small"
          sx={{ fontSize: '10px', height: 20, backgroundColor: s.bg, color: s.color, flexShrink: 0 }}
        />
      </Box>

      {/* スコア部分 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
        {/* チームA */}
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {teamA}
          </Typography>
        </Box>

        {/* スコア */}
        {isFinished ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', lineHeight: 1 }}>
              {match.scoreA}
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#888', lineHeight: 1 }}>-</Typography>
            <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', lineHeight: 1 }}>
              {match.scoreB}
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ fontSize: '14px', color: '#AAA', fontWeight: 500 }}>vs</Typography>
        )}

        {/* チームB */}
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {teamB}
          </Typography>
        </Box>
      </Box>

      {/* フッター: 時間 + 場所 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14, color: '#888' }} />
          <Typography sx={{ fontSize: '11px', color: '#666' }}>
            {formatTime(match.time)}
          </Typography>
        </Box>
        {match.locationName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: '#888' }} />
            <Typography sx={{ fontSize: '11px', color: '#666' }}>
              {match.locationName}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
