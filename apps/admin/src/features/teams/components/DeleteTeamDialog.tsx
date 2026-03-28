import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

type Props = {
  open: boolean
  teamName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteTeamDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' },
      }}
    >
      <DialogTitle sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
        チームを削除しますか？
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
          この操作は元に戻せません。チームを削除してもよろしいですか？
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            fontSize: '13px',
            color: '#2F3C8C',
            '&:hover': { backgroundColor: '#E8EAF6' },
          }}
        >
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
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
  )
}
