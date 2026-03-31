import {
  Box,
  Breadcrumbs,
  ButtonBase,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useRoleCreate } from '../hooks/useRoleCreate'
import { ALL_PERMISSIONS } from '../types'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

const INPUT_SX = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
  },
  '& .MuiInputBase-input': { color: '#2F3C8C', fontSize: '13px' },
  '& .MuiInputLabel-root': { color: '#5B6DC6', fontSize: '13px' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#5B6DC6' },
}

type Props = {
  onBack: () => void
}

export function RoleCreatePage({ onBack }: Props) {
  const { name, setName, description, setDescription, permissions, togglePermission, handleCreate } = useRoleCreate()
  const [submitted, setSubmitted] = useState(false)

  const permissionsByCategory = ALL_PERMISSIONS.reduce<Record<string, typeof ALL_PERMISSIONS>>((acc, p) => {
    ;(acc[p.category] ??= []).push(p)
    return acc
  }, {})

  const onCreate = () => {
    setSubmitted(true)
    if (!name.trim()) return
    handleCreate()
    showToast('ロールを作成しました')
    onBack()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          権限
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          ロール作成
        </Typography>
      </Breadcrumbs>

      {/* カード */}
      <Box
        sx={{
          background: CARD_GRADIENT,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          ロール作成
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="名前*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={submitted && !name.trim()}
          helperText={submitted && !name.trim() ? 'この項目は必須です' : ''}
          sx={INPUT_SX}
        />

        <TextField
          fullWidth
          size="small"
          label="備考*"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={INPUT_SX}
        />

        <Box sx={{ border: '1px solid', borderColor: 'primary.light', borderRadius: 1.5, px: 2, py: 1.5, mb: 2 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', mb: 1 }}>権限</Typography>
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <Box key={category} sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: '12px', color: '#2F3C8C', fontWeight: 600, mb: 0.5 }}>{category}</Typography>
              {perms.map(perm => (
                <FormControlLabel
                  key={perm.key}
                  control={
                    <Checkbox
                      checked={permissions.includes(perm.key)}
                      onChange={() => togglePermission(perm.key)}
                      size="small"
                      sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.dark' } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{perm.label}</Typography>}
                  sx={{ ml: 0, display: 'block' }}
                />
              ))}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={onCreate}
            disabled={submitted && !name.trim()}
            sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
          >
            作成
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
              fontSize: '13px',
              height: '40px',
              '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' },
            }}
          >
            キャンセル
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
