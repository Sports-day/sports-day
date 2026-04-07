import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { CARD_FIELD_SX } from '@/styles/commonSx'
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_BUTTON,
  COLOR_BG_DEFAULT,
} from '@/styles/colors'
import { CompetitionType } from '@/gql/__generated__/graphql'

const TYPE_OPTIONS = [
  { value: CompetitionType.League, label: 'リーグ' },
  { value: CompetitionType.Tournament, label: 'トーナメント' },
]

type Props = {
  value: CompetitionType | null
  onChange: (type: CompetitionType | null) => void
}

export function CompetitionTypeSelect({ value, onChange }: Props) {
  return (
    <FormControl fullWidth size="small" sx={CARD_FIELD_SX}>
      <InputLabel shrink>大会形式*</InputLabel>
      <Select
        value={value ?? ''}
        label="大会形式*"
        displayEmpty
        onChange={(e) => onChange((e.target.value as CompetitionType) || null)}
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
          const opt = TYPE_OPTIONS.find(o => o.value === v)
          return (
            <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK }}>{opt?.label}</Typography>
          )
        }}
      >
        {TYPE_OPTIONS.map((opt) => {
          const isSelected = opt.value === value
          return (
            <MenuItem
              key={opt.value}
              value={opt.value}
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
                {opt.label}
              </Typography>
              {isSelected && <CheckIcon sx={{ fontSize: 16, color: COLOR_PRIMARY_BUTTON }} />}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
