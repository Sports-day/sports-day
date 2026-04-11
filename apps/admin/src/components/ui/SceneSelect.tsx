import { Box, Checkbox, Chip, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import type { SelectChangeEvent } from '@mui/material'
import { CARD_FIELD_SX } from '@/styles/commonSx'
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_BUTTON,
  COLOR_BG_DEFAULT,
} from '@/styles/colors'

type Scene = { id: string; name: string }

const DISABLED_LABEL_SX = {
  '& .MuiInputLabel-root.Mui-disabled': { color: '#9E9E9E', opacity: 1 },
}

const MENU_PAPER_SX = {
  backgroundColor: COLOR_BG_DEFAULT,
  borderRadius: 1.5,
  boxShadow: '0 4px 16px rgba(47, 60, 140, 0.15)',
  mt: 0.5,
  maxHeight: 300,
}

type MultiProps = {
  multiple: true
  value: string[]
  onChange: (sceneIds: string[]) => void
  scenes: Scene[]
  label?: string
  disabled?: boolean
}

type SingleProps = {
  multiple?: false
  value: string | null
  onChange: (sceneId: string | null) => void
  scenes: Scene[]
  label?: string
  disabled?: boolean
}

type Props = MultiProps | SingleProps

export function SceneSelect(props: Props) {
  const { scenes, label = 'タグ', disabled } = props

  if (props.multiple) {
    return <MultiSelect value={props.value} onChange={props.onChange} scenes={scenes} label={label} disabled={disabled} />
  }
  return <SingleSelect value={props.value} onChange={props.onChange} scenes={scenes} label={label} disabled={disabled} />
}

function MultiSelect({ value, onChange, scenes, label, disabled }: { value: string[]; onChange: (ids: string[]) => void; scenes: Scene[]; label: string; disabled?: boolean }) {
  const handleChange = (e: SelectChangeEvent<string[]>) => {
    const v = e.target.value
    onChange(typeof v === 'string' ? v.split(',') : v)
  }

  return (
    <FormControl fullWidth size="small" sx={{ ...CARD_FIELD_SX, ...DISABLED_LABEL_SX }} disabled={disabled}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        multiple
        value={value}
        label={label}
        displayEmpty
        disabled={disabled}
        onChange={handleChange}
        MenuProps={{ PaperProps: { sx: MENU_PAPER_SX } }}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK, opacity: 0.5 }}>未設定</Typography>
          }
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => {
                const scene = scenes.find(s => s.id === id)
                return scene ? (
                  <Chip
                    key={id}
                    label={scene.name}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '12px',
                      fontWeight: 500,
                      color: COLOR_PRIMARY_DARK,
                      backgroundColor: '#E8EAF6',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                ) : null
              })}
            </Box>
          )
        }}
      >
        {scenes.map((scene) => {
          const isSelected = value.includes(scene.id)
          return (
            <MenuItem
              key={scene.id}
              value={scene.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                py: 0.5,
                backgroundColor: isSelected ? '#E8EAF6' : 'transparent',
                '&:hover': { backgroundColor: isSelected ? '#DCE0F5' : '#E5E6F0' },
              }}
            >
              <Checkbox
                checked={isSelected}
                size="small"
                sx={{ p: 0.25, color: '#AAAAAA', '&.Mui-checked': { color: COLOR_PRIMARY_BUTTON } }}
              />
              <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: isSelected ? 600 : 400 }}>
                {scene.name}
              </Typography>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

function SingleSelect({ value, onChange, scenes, label, disabled }: { value: string | null; onChange: (id: string | null) => void; scenes: Scene[]; label: string; disabled?: boolean }) {
  return (
    <FormControl fullWidth size="small" sx={{ ...CARD_FIELD_SX, ...DISABLED_LABEL_SX }} disabled={disabled}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        value={value ?? ''}
        label={label}
        displayEmpty
        disabled={disabled}
        onChange={(e) => onChange(e.target.value || null)}
        MenuProps={{ PaperProps: { sx: MENU_PAPER_SX } }}
        renderValue={(v) => {
          if (!v) return <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK, opacity: 0.5 }}>未設定</Typography>
          const scene = scenes.find(s => s.id === v)
          return <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK }}>{scene?.name}</Typography>
        }}
      >
        {scenes.map((scene) => {
          const isSelected = scene.id === value
          return (
            <MenuItem
              key={scene.id}
              value={scene.id}
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
                {scene.name}
              </Typography>
              {isSelected && <CheckIcon sx={{ fontSize: 16, color: COLOR_PRIMARY_BUTTON }} />}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
