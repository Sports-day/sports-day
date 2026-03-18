import { Button } from '@mui/material'
import type { Competition } from '../types'

type CompetitionCardProps = {
  competition: Competition
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  return (
    <Button
      variant="text"
      sx={{
        backgroundColor: '#EFF0F8',
        width: '100%',
        height: 60,
        border: 'none',
        borderRadius: 1,
        justifyContent: 'flex-start',
        px: 2,
        fontSize: '15px',
        fontWeight: 600,
        color: '#2F3C8C',
        '&:hover': { backgroundColor: '#E5E6F0', border: 'none' },
      }}
    >
      {competition.name}
    </Button>
  )
}
