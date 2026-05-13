import {
  Box,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material'
import {
  CARD_GRADIENT,
  CARD_TABLE_CELL_SX,
} from '@/styles/commonSx'
import type { SportGroup } from '../types'

type Props = {
  sportGroups: SportGroup[]
  onToggle: (sportSceneId: string, entryId: string | null) => void
  loading?: boolean
}

export function SportEntrySection({ sportGroups, onToggle, loading }: Props) {
  return (
    <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          スポーツエントリー
        </Typography>

        {loading ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <CircularProgress size={24} sx={{ color: '#5B6DC6' }} />
          </Box>
        ) : sportGroups.length === 0 ? (
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5 }}>
            登録可能なスポーツシーンがありません
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {sportGroups.map((sg, idx) => (
              <Box key={sg.sportId}>
                {idx > 0 && <Divider sx={{ mb: 1.5, borderColor: 'rgba(47, 60, 140, 0.15)' }} />}
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }}>
                  {sg.sportName}
                </Typography>
                {sg.scenes.map(scene => (
                  <Box
                    key={scene.sportSceneId}
                    onClick={() => onToggle(scene.sportSceneId, scene.entryId)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 0.5,
                      py: 0.25,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(91, 109, 198, 0.08)' },
                    }}
                  >
                    <Checkbox
                      checked={scene.isRegistered}
                      size="small"
                      sx={{
                        p: 0.25,
                        color: '#AAAAAA',
                        '&.Mui-checked': { color: '#5B6DC6' },
                      }}
                    />
                    <Typography sx={{ ...CARD_TABLE_CELL_SX, fontSize: '13px' }}>
                      {scene.sceneName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
