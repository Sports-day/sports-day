import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '削除',
  cancelLabel = 'キャンセル',
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden', backgroundColor: '#EFF0F8' } } }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <WarningAmberIcon sx={{ color: '#D71212', fontSize: 22 }} />
        <DialogTitle id="confirm-dialog-title" sx={{ p: 0, fontSize: '16px', fontWeight: 700, color: '#D71212' }}>
          {title}
        </DialogTitle>
      </Box>
      <DialogContent sx={{ px: 3, pt: 1.5, pb: 3 }}>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', lineHeight: 1.7 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              backgroundColor: 'transparent',
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              height: '40px',
              fontSize: '13px',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#E0E3F5', borderColor: '#5B6DC6' },
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={onConfirm}
            sx={{
              height: '40px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#D71212',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#B50E0E', boxShadow: 'none' },
            }}
          >
            {confirmLabel}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
