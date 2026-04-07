import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckIcon from '@mui/icons-material/Check'
import { useTiebreak } from '../hooks/useTiebreak'
import { useEffect } from 'react'
import { showToast } from '@/lib/toast'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

type TiedGroup = {
  rank: number
  teams: { id: string; name: string }[]
}

type Props = {
  leagueId: string
  tiedGroups: TiedGroup[]
}

export function TiebreakCard({ leagueId, tiedGroups }: Props) {
  const tiebreak = useTiebreak(leagueId)

  const allTiedTeams = tiedGroups.flatMap(g =>
    g.teams.map(t => ({ id: t.id, name: t.name, rank: g.rank }))
  )

  useEffect(() => {
    if (allTiedTeams.length > 0) {
      tiebreak.initOrder(allTiedTeams)
    }
  }, [tiedGroups.map(g => g.teams.map(t => t.id).join(',')).join('|')])

  if (tiedGroups.length === 0) return null

  const handleSave = async () => {
    await tiebreak.handleSave()
    showToast('タイブレーク優先度を保存しました')
  }

  return (
    <Card sx={{ background: CARD_GRADIENT, overflow: 'hidden' }}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <WarningAmberIcon sx={{ fontSize: 20, color: '#E68A00' }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
            同順位のチームがあります
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: '#FFF8E1', borderRadius: 1, px: 2, py: 1, mb: 2 }}>
          <Typography sx={{ fontSize: '12px', color: '#795548' }}>
            ランキングルールで順位が決定できないチームがあります。ドラッグで優先順位を設定してください。上にあるチームほど上位になります。
          </Typography>
        </Box>

        {tiedGroups.map((group) => (
          <Box key={group.rank} sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.7, mb: 0.5 }}>
              {group.rank}位タイ（{group.teams.length}チーム）
            </Typography>

            {tiebreak.order
              .filter(t => group.teams.some(gt => gt.id === t.id))
              .map((team, index) => {
                const globalIndex = tiebreak.order.findIndex(t => t.id === team.id)
                return (
                  <Box
                    key={team.id}
                    draggable
                    onDragStart={() => tiebreak.handleDragStart(globalIndex)}
                    onDragOver={(e) => tiebreak.handleDragOver(e, globalIndex)}
                    onDragEnd={tiebreak.handleDragEnd}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5,
                      px: 1.5,
                      py: 1,
                      backgroundColor: tiebreak.dragIndex === globalIndex ? '#C8CAD9' : '#EFF0F8',
                      borderRadius: 1,
                      border: '1px solid #5B6DC6',
                      cursor: 'grab',
                      userSelect: 'none',
                    }}
                  >
                    <DragIndicatorIcon sx={{ fontSize: 16, color: '#5B6DC6', opacity: 0.6, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 500 }}>
                      {index + 1}. {team.name}
                    </Typography>
                  </Box>
                )
              })}
          </Box>
        ))}

        <Button
          variant="contained"
          fullWidth
          startIcon={<CheckIcon />}
          onClick={handleSave}
          disabled={tiebreak.loading}
          sx={SAVE_BUTTON_SX}
        >
          {tiebreak.loading ? '保存中...' : 'タイブレーク優先度を保存'}
        </Button>
      </CardContent>
    </Card>
  )
}
