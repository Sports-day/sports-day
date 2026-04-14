import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import { BackButton } from '@/components/ui/BackButton'
import { useSportDetail } from '../hooks/useSportDetail'
import { ImageSelectDialog } from './ImageSelectDialog'
import { SportRulesSection } from './SportRulesSection'
import { SceneSelect } from '@/components/ui/SceneSelect'
import { ScoringDnDList } from '@/features/competitions/components/ScoringDnDList'
import { SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, CARD_FIELD_SX } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type Props = {
  sportId: string
  onBack: () => void
  onDelete: () => void
}

export function SportDetailPage({ sportId, onBack, onDelete }: Props) {
  const {
    sport,
    name,
    setName,
    experiencedLimit,
    setExperiencedLimit,
    imageId,
    setImageId,
    images,
    usedImageIds,
    rankingKeys,
    setRankingKeys,
    rankingConditionOptions,
    sceneIds,
    setSceneIds,
    allScenes,
    dirty,
    handleSave,
    handleDelete,
  } = useSportDetail(sportId, onDelete)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useUnsavedWarning(dirty)

  if (!sport) {
    return (
      <Box>
        <Typography sx={{ color: '#2F3C8C', mt: 2 }}>競技が見つかりません</Typography>
      </Box>
    )
  }

  const handleSaveWithToast = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await handleSave()
      showToast('競技を保存しました')
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  const onConfirmDelete = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setDeleteDialogOpen(false)
    try {
      await handleDelete()
      showToast('競技を削除しました')
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  const dndOptions = rankingConditionOptions.map(o => ({ value: o.value as string, label: o.label }))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {sport.name}
        </Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
            競技の編集
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
            {/* 左: 画像選択 */}
            <Box sx={{ gridRow: '1 / -1' }}>
              {imageId ? (
                <Box sx={{ position: 'relative', height: '100%' }}>
                  <Box
                    component="img"
                    src={images.find(i => i.id === imageId)?.url}
                    onClick={() => setImageDialogOpen(true)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 1.5,
                      border: '2px solid #3949AB',
                      display: 'block',
                      cursor: 'pointer',
                    }}
                  />
                  <Box
                    onClick={() => setImageId(null)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#5F6DC2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                      '&:hover': { backgroundColor: '#D71212' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14, color: '#fff' }} />
                  </Box>
                </Box>
              ) : (
                <Box
                  onClick={() => setImageDialogOpen(true)}
                  sx={{
                    height: '100%',
                    aspectRatio: '1',
                    borderRadius: 1.5,
                    border: '2px dashed #7F8CD6',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': {
                      borderColor: '#3949AB',
                      backgroundColor: 'rgba(57, 73, 171, 0.06)',
                    },
                  }}
                >
                  <ImageIcon sx={{ fontSize: 24, color: '#5B6DC6', opacity: 0.6 }} />
                  <Typography sx={{ fontSize: '9px', color: '#5B6DC6', opacity: 0.7, fontWeight: 500 }}>
                    画像を選択
                  </Typography>
                </Box>
              )}
              <ImageSelectDialog
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                images={images}
                selectedImageId={imageId}
                usedImageIds={usedImageIds}
                onSelect={(id) => setImageId(id)}
              />
            </Box>

            {/* 右: 名称・タグ */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="名称*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                error={!name.trim() && dirty}
                helperText={!name.trim() && dirty ? 'この項目は必須です' : name.length >= 60 ? `${name.length}/64文字` : ''}
                sx={CARD_FIELD_SX}
                slotProps={{ htmlInput: { maxLength: 64 } }}
              />

              <TextField
                label="経験者上限（1チームあたり）"
                type="number"
                value={experiencedLimit ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  setExperiencedLimit(v === '' ? null : Number(v))
                }}
                fullWidth
                size="small"
                helperText="未設定の場合は制限なし"
                sx={CARD_FIELD_SX}
                slotProps={{ htmlInput: { min: 0, step: 1 }, formHelperText: { sx: { color: '#5F6DC2', opacity: 0.5, ml: 0 } } }}
              />

              <SceneSelect multiple value={sceneIds} onChange={setSceneIds} scenes={allScenes} />
            </Box>
          </Box>

          <Box>
            <ScoringDnDList
              options={dndOptions}
              selected={rankingKeys as string[]}
              onChange={(selected) => setRankingKeys(selected as typeof rankingKeys)}
            />
          </Box>

          <SportRulesSection
            sportId={sportId}
            rule={sport.rules?.[0]?.id ? { id: sport.rules[0].id, rule: sport.rules[0].rule } : null}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={DELETE_BUTTON_SX}
            >
              この競技を削除
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckIcon />}
              onClick={handleSaveWithToast}
              disabled={!dirty || !name.trim() || isSubmitting}
              sx={SAVE_BUTTON_SX}
            >
              保存
            </Button>
          </Box>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="競技を削除しますか？"
        description={`「${sport.name}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
