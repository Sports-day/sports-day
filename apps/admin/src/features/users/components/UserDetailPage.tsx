import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { BackButton } from '@/components/ui/BackButton'
import { useUserDetail } from '../hooks/useUserDetail'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { showToast } from '@/lib/toast'
import { SceneSelect } from '@/components/ui/SceneSelect'
import { SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type Props = {
  userId: string
  onBack: () => void
}

export function UserDetailPage({ userId, onBack }: Props) {
  const {
    userName,
    groupId,
    setGroupId,
    groups,
    role,
    setRole,
    experiencedSportIds,
    setExperiencedSportIds,
    allSports,
    dirty,
    handleSave,
    handleDeleteUser,
    deleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    roleScenes,
  } = useUserDetail(userId)

  useUnsavedWarning(dirty)

  const onSave = async () => {
    try {
      await handleSave()
      showToast('ユーザーを保存しました')
      onBack()
    } catch {
      // エラートーストはhook側で表示済み
    }
  }

  const onConfirmDelete = async () => {
    closeDeleteDialog()
    try {
      await handleDeleteUser()
      showToast('ユーザーを削除しました')
      onBack()
    } catch {
      // エラートーストはhook側で表示済み
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          ユーザー
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {userName}
        </Typography>
      </Breadcrumbs>

      {/* カード */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {userName}さんの情報
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* 所属クラス */}
            <SceneSelect
              value={groupId || null}
              onChange={(id) => setGroupId(id ?? '')}
              scenes={groups}
              label="所属クラス"
            />

            {/* ロール */}
            <SceneSelect
              value={role || null}
              onChange={(id) => setRole(id ?? '')}
              scenes={roleScenes}
              label="ロール"
            />

            {/* 経験者スポーツ */}
            <SceneSelect
              multiple
              value={experiencedSportIds}
              onChange={setExperiencedSportIds}
              scenes={allSports}
              label="経験者（部活動所属）"
            />

            {/* ボタン */}
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={openDeleteDialog}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0 }}
              >
                このユーザーを削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                disabled={!dirty}
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
        title="ユーザーを削除しますか？"
        description="この操作は元に戻せません。ユーザーを削除してもよろしいですか？"
        onClose={closeDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
