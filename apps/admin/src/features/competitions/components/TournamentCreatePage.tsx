import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useState } from 'react'
import { useTournamentCreate } from '../hooks/useTournamentCreate'
import {
  BREADCRUMB_CURRENT_SX,
  BREADCRUMB_LINK_SX,
  CARD_FIELD_CREATE_SX,
  CARD_GRADIENT,
  SAVE_BUTTON_SX,
} from '@/styles/commonSx'
import { showToast } from '@/lib/toast'
import { TAG_OPTIONS } from '../constants'

const PLACEMENT_OPTIONS = [
  { value: 'SEED_OPTIMIZED', label: 'シード最適化（上位シード同士が終盤まで当たらない）' },
  { value: 'BALANCED', label: '均等配置（上位と下位が序盤で対戦）' },
  { value: 'RANDOM', label: 'ランダム配置' },
  { value: 'MANUAL', label: '手動配置（進出ルールでスロットを個別指定）' },
]

type Props = {
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
  onSave: () => void
}

export function TournamentCreatePage({
  competitionId,
  competitionName,
  onBackToList,
  onBackToDetail,
  onSave,
}: Props) {
  const { form, handleChange, handleSubmit } = useTournamentCreate(competitionId, onSave)
  const [submitted, setSubmitted] = useState(false)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <ButtonBase onClick={onBackToDetail} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>トーナメントを作成</Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmojiEventsIcon sx={{ color: '#2F3C8C', fontSize: 20 }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              トーナメントを作成
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 基本情報 */}
            <TextField
              placeholder="トーナメント名*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={submitted && !form.name.trim()}
              helperText={submitted && !form.name.trim() ? 'この項目は必須です' : ''}
              sx={CARD_FIELD_CREATE_SX}
            />

            <TextField
              placeholder="説明（任意）"
              value={form.description}
              onChange={handleChange('description')}
              fullWidth
              size="small"
              sx={CARD_FIELD_CREATE_SX}
            />

            {/* チーム数 */}
            <TextField
              label="参加チーム数*"
              type="number"
              value={form.teamCount}
              onChange={handleChange('teamCount')}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 2, max: 64 } }}
              helperText="本戦と順位決定戦（3位決定戦等）が自動生成されます"
              sx={CARD_FIELD_CREATE_SX}
            />

            {/* シード配置方法 */}
            <TextField
              select
              label="シード配置方法"
              value={form.placementMethod}
              onChange={handleChange('placementMethod')}
              fullWidth
              size="small"
              sx={CARD_FIELD_CREATE_SX}
            >
              {PLACEMENT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            {/* タグ */}
            <TextField
              select
              value={form.tag}
              onChange={handleChange('tag')}
              fullWidth
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  if (!value)
                    return (
                      <Typography
                        component="span"
                        sx={{ color: '#2F3C8C', opacity: 0.5, fontSize: 'inherit' }}
                      >
                        タグ
                      </Typography>
                    )
                  const opt = TAG_OPTIONS.find((o) => o.value === value)
                  return opt ? opt.label : String(value)
                },
              }}
              sx={CARD_FIELD_CREATE_SX}
            >
              {TAG_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckIcon />}
              disabled={submitted && !form.name.trim()}
              onClick={() => { setSubmitted(true); if (!form.name.trim()) return; handleSubmit(); showToast('トーナメントを作成しました') }}
              sx={{ ...SAVE_BUTTON_SX, fontSize: '14px', '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
            >
              作成
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
