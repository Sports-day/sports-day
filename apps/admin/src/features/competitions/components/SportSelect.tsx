import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { CARD_FIELD_SX } from '@/styles/commonSx'
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_BUTTON,
  COLOR_BG_DEFAULT,
} from '@/styles/colors'

type Sport = { id: string; name: string }

type Props = {
  value: string | null
  onChange: (sportId: string | null) => void
  sports: Sport[]
}

export function SportSelect({ value, onChange, sports }: Props) {
  return (
    <FormControl fullWidth size="small" sx={CARD_FIELD_SX}>
      <InputLabel shrink>競技*</InputLabel>
      <Select
        value={value ?? ''}
        label="競技*"
        displayEmpty
        onChange={(e) => onChange(e.target.value || null)}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: COLOR_BG_DEFAULT,
              borderRadius: 1.5,
              boxShadow: '0 4px 16px rgba(47, 60, 140, 0.15)',
              mt: 0.5,
            },
          },
        }}
        renderValue={(v) => {
          if (!v) return <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK, opacity: 0.5 }}>未設定</Typography>
          const sport = sports.find(s => s.id === v)
          return (
            <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK }}>{sport?.name}</Typography>
          )
        }}
      >
        {sports.map((sport) => {
          const isSelected = sport.id === value
          return (
            <MenuItem
              key={sport.id}
              value={sport.id}
              onClick={(e) => {
                if (isSelected) {
                  e.preventDefault()
                  onChange(null)
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
                backgroundColor: isSelected ? '#E8EAF6' : 'transparent',
                '&:hover': { backgroundColor: isSelected ? '#DCE0F5' : '#E5E6F0' },
              }}
            >
              <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                {sport.name}
              </Typography>
              {isSelected && <CheckIcon sx={{ fontSize: 16, color: COLOR_PRIMARY_BUTTON }} />}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
