import { Box, Breadcrumbs, ButtonBase, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useCompetitionCreate } from '../hooks/useCompetitionCreate'
import type { CompetitionType } from '@/gql/__generated__/graphql'
import { SportSelect } from './SportSelect'
import { CompetitionTypeSelect } from './CompetitionTypeSelect'
import { SceneSelect } from '@/components/ui/SceneSelect'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX, CARD_FIELD_SX } from '@/styles/commonSx'

const FIELD_SX = {
  ...CARD_FIELD_SX,
  '& .MuiFormHelperText-root': { color: '#2F3C8C', opacity: 0.6, ml: 0 },
  '& input::placeholder': { color: '#2F3C8C', opacity: 0.5 },
}

type Props = {
  onBack: () => void
  onSave: (id: string, name: string, type: CompetitionType) => void
}

export function CompetitionCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit, scenes, sports, sportId, setSportId, sceneId, setSceneId, setCompetitionType } = useCompetitionCreate(onSave)
  const [submitted, setSubmitted] = useState(false)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 1 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          大会
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          新規作成
        </Typography>
      </Breadcrumbs>

      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        新規作成
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            大会の情報
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="大会名*"
              placeholder="例: バスケットボール晴天時"
              helperText={submitted && !form.name.trim() ? 'この項目は必須です' : undefined}
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={submitted && !form.name.trim()}
              sx={FIELD_SX}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <SportSelect value={sportId || null} onChange={(id) => setSportId(id ?? '')} sports={sports} />

            <CompetitionTypeSelect value={form.competitionType} onChange={setCompetitionType} />

            <SceneSelect value={sceneId || null} onChange={(id) => setSceneId(id ?? '')} scenes={scenes} label="タグ*" disabled={!sportId} />

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
                disabled={!form.name.trim() || !sportId || !form.competitionType || !sceneId}
                onClick={() => { setSubmitted(true); if (!form.name.trim() || !sportId || !form.competitionType || !sceneId) return; handleSubmit() }}
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
