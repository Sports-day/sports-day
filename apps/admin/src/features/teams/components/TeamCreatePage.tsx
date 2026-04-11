import {
  Box,
  Breadcrumbs,
  ButtonBase,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useTeamCreate } from '../hooks/useTeamCreate'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX, CARD_FIELD_SX } from '@/styles/commonSx'
import { BackButton } from '@/components/ui/BackButton'

const FIELD_SX = {
  ...CARD_FIELD_SX,
  '& .MuiFormHelperText-root': { color: '#2F3C8C', opacity: 0.6, ml: 0 },
  '& input::placeholder': { color: '#2F3C8C', opacity: 0.5 },
}

const SELECT_SX = {
  backgroundColor: 'transparent',
  '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
  '&:hover fieldset': { borderColor: '#5B6DC6' },
  '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
  '& .MuiSelect-select': { color: '#2F3C8C', fontSize: '14px' },
}

type Props = {
  onBack: () => void
  onSave: (id: string) => void
}

export function TeamCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit, groups, groupId, setGroupId } = useTeamCreate(onSave)
  const [submitted, setSubmitted] = useState(false)

  return (
    <Box>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 1 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          チーム
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          新規作成
        </Typography>
      </Breadcrumbs>

      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        新規作成
      </Typography>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            チームの情報
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="チーム名*"
              placeholder="例: Aチーム"
              helperText={submitted && !form.name.trim() ? 'この項目は必須です' : form.name.length >= 60 ? `${form.name.length}/64文字` : undefined}
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={submitted && !form.name.trim()}
              sx={FIELD_SX}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { maxLength: 64 } }}
            />

            <FormControl fullWidth size="small" error={submitted && !groupId}>
              <InputLabel shrink sx={{ color: '#2F3C8C', opacity: 0.7, '&.Mui-focused': { color: '#2F3C8C', opacity: 1 } }}>
                クラス*
              </InputLabel>
              <Select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                displayEmpty
                label="クラス*"
                notched
                sx={SELECT_SX}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: '#2F3C8C', opacity: 0.5, fontSize: '14px' }}>
                    クラスを選択
                  </Typography>
                </MenuItem>
                {groups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                ))}
              </Select>
              {submitted && !groupId && (
                <Typography sx={{ color: '#d32f2f', fontSize: '12px', mt: 0.5, ml: 0 }}>
                  この項目は必須です
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{
                  backgroundColor: 'transparent',
                  color: '#2F3C8C',
                  borderColor: '#5B6DC6',
                  boxShadow: 'none',
                  whiteSpace: 'nowrap',
                  height: '40px',
                  fontSize: '13px',
                  '&:hover': { backgroundColor: '#E0E3F5', borderColor: '#5B6DC6' },
                }}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                disabled={!form.name.trim() || !groupId}
                onClick={() => { setSubmitted(true); if (!form.name.trim() || !groupId) return; handleSubmit() }}
                sx={{ ...SAVE_BUTTON_SX, fontSize: '14px' }}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
