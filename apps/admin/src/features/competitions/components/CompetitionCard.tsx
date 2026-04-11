import { type ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import type { Competition } from '../types'

type CompetitionCardProps = {
  competition: Competition
  onSelect?: () => void
  dragHandle?: ReactNode
}

export function CompetitionCard({ competition, onSelect, dragHandle }: CompetitionCardProps) {
  return (
    <Button
      variant="text"
      onClick={onSelect}
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        {dragHandle}
        <GroupsIcon sx={{ fontSize: 20, color: '#4A5ABB' }} />
        <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 400 }}>
          {competition.name}
        </Typography>
      </Box>
    </Button>
  )
}
