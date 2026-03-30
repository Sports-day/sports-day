import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useTournamentCreate } from '../hooks/useTournamentCreate'
import {
  BREADCRUMB_CURRENT_SX,
  BREADCRUMB_LINK_SX,
  CARD_FIELD_CREATE_SX,
  CARD_GRADIENT,
  SAVE_BUTTON_SX,
} from '@/styles/commonSx'
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
  const { form, handleChange, handleToggle, handleSubmit } = useTournamentCreate(competitionId, onSave)

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
              helperText="ブラケットの構造が自動生成されます"
              sx={CARD_FIELD_CREATE_SX}
            />

            {/* サブブラケットオプション */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 1.5,
                px: 2,
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#2F3C8C', fontWeight: 600, mb: 0.5 }}>
                サブブラケット（自動生成）
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.hasThirdPlace}
                    onChange={() => handleToggle('hasThirdPlace')}
                    size="small"
                    sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.dark' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                    3位決定戦を追加
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.hasFifthPlace}
                    onChange={() => handleToggle('hasFifthPlace')}
                    size="small"
                    sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.dark' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                    5〜8位決定戦を追加
                  </Typography>
                }
              />
            </Box>

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
              onClick={handleSubmit}
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
