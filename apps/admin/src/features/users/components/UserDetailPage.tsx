import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useUserDetail } from '../hooks/useUserDetail'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { showToast } from '@/lib/toast'
import { SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

const SELECT_SX = {
  backgroundColor: 'transparent',
  color: '#2F3C8C',
  fontSize: '13px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6', borderWidth: '1px' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6', borderWidth: '1px' },
}

const LABEL_SX = {
  color: '#2F3C8C',
  fontSize: '13px',
  opacity: 0.7,
  '&.Mui-focused': { color: '#2F3C8C', opacity: 1 },
}

type Props = {
  userId: string
  onBack: () => void
}

export function UserDetailPage({ userId, onBack }: Props) {
  const {
    userName,
    gender,
    setGender,
    userClass,
    setUserClass,
    role,
    setRole,
    handleSave,
    handleDeleteUser,
    deleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    genderOptions,
    classOptions,
    roleOptions,
  } = useUserDetail(userId)

  const [dirty, setDirty] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = () => {
    handleSave()
    setDirty(false)
    showToast('ユーザーを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    closeDeleteDialog()
    handleDeleteUser()
    showToast('ユーザーを削除しました')
    onBack()
  }

  return (
    <Box>
      {/* パンくずリスト */}
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          ユーザー
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {userName}
        </Typography>
      </Breadcrumbs>

      {/* カード */}
      <Box
        sx={{
          background: CARD_GRADIENT,
          borderRadius: 2,
          p: 2,
        }}
        onChangeCapture={() => setDirty(true)}
      >
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }}>
          {userName}さんの情報
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', mb: 2 }}>
          {userName}
        </Typography>

        {/* 性別 */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={LABEL_SX}>性別</InputLabel>
          <Select
            value={gender}
            label="性別"
            onChange={(e) => setGender(e.target.value)}
            sx={SELECT_SX}
          >
            {genderOptions.map((g) => (
              <MenuItem key={g} value={g} sx={{ fontSize: '13px', color: '#2F3C8C' }}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 所属クラス */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={LABEL_SX}>所属クラス</InputLabel>
          <Select
            value={userClass}
            label="所属クラス"
            onChange={(e) => setUserClass(e.target.value)}
            sx={SELECT_SX}
          >
            {classOptions.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: '13px', color: '#2F3C8C' }}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ロール */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={LABEL_SX}>ロール</InputLabel>
          <Select
            value={role}
            label="ロール"
            onChange={(e) => setRole(e.target.value)}
            sx={SELECT_SX}
          >
            {roleOptions.map((r) => (
              <MenuItem key={r} value={r} sx={{ fontSize: '13px', color: '#2F3C8C' }}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ボタン */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
            onClick={openDeleteDialog}
            sx={DELETE_BUTTON_SX}
          >
            このユーザーを削除
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={onSave}
            sx={SAVE_BUTTON_SX}
          >
            保存
          </Button>
        </Box>
      </Box>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        aria-labelledby="delete-dialog-title"
        PaperProps={{ sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          ユーザーを削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            この操作は元に戻せません。ユーザーを削除してもよろしいですか？
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={closeDeleteDialog}
            sx={{ fontSize: '13px', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6' } }}
          >
            キャンセル
          </Button>
          <Button
            onClick={onConfirmDelete}
            variant="outlined"
            sx={{
              fontSize: '13px',
              color: '#D71212',
              backgroundColor: 'transparent',
              borderColor: '#D71212',
              '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
