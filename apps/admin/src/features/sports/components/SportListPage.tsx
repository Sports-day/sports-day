import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SportsIcon from '@mui/icons-material/Sports'
import { useSports } from '../hooks/useSports'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onNavigateToCreate: () => void
  onSelectSport: (id: string) => void
}

export function SportListPage({ onNavigateToCreate, onSelectSport }: Props) {
  const { data: sports, loading, error } = useSports()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        競技
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべての競技
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onNavigateToCreate}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              競技を新規作成
            </Button>
          </Box>

          {sports.length === 0 ? (
            <Typography sx={{ py: 8, color: '#888', fontSize: '13px', textAlign: 'center' }}>
              データがありません
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {sports.map((sport) => (
                <Button
                  key={sport.id}
                  variant="text"
                  onClick={() => onSelectSport(sport.id)}
                  sx={{
                    backgroundColor: '#EFF0F8',
                    width: '100%',
                    height: 50,
                    borderRadius: 1,
                    justifyContent: 'flex-start',
                    px: 2,
                    '&.MuiButton-root': { border: 'none', outline: 'none' },
                    '&:hover': { backgroundColor: '#E5E6F0' },
                    '&:focus-visible': { outline: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {sport.imageUrl ? (
                      <Box
                        component="img"
                        src={sport.imageUrl}
                        sx={{ width: 24, height: 24, borderRadius: 0.5, objectFit: 'cover' }}
                      />
                    ) : (
                      <SportsIcon sx={{ fontSize: 20, color: '#4A5ABB' }} />
                    )}
                    <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 400 }}>
                      {sport.name}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
