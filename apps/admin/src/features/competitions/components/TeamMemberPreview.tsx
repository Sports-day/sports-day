import { Box, Chip, Typography } from '@mui/material'
import type { EntryTeamMember } from '../hooks/useAddEntryTeams'

type Props = {
  members: EntryTeamMember[]
  sportId: string
}

export function TeamMemberPreview({ members, sportId }: Props) {
  if (members.length === 0) {
    return (
      <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.5, py: 0.5 }}>
        メンバーがいません
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {members.map(member => (
        <Chip
          key={member.id}
          label={member.name}
          size="small"
          sx={{
            height: 24,
            fontSize: '11px',
            fontWeight: member.isExperienced && sportId ? 600 : 400,
            backgroundColor: member.isExperienced && sportId ? '#FFF3E0' : '#F5F6FC',
            color: member.isExperienced && sportId ? '#E65100' : '#2F3C8C',
            borderColor: member.isExperienced && sportId ? '#FB8C00' : '#D0D3E8',
            border: '1px solid',
          }}
        />
      ))}
    </Box>
  )
}
