import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import type { Image } from '@/features/images/types'

type Props = {
  open: boolean
  onClose: () => void
  images: Image[]
  selectedImageId: string | null
  usedImageIds: Set<string>
  onSelect: (imageId: string) => void
}

export function ImageSelectDialog({ open, onClose, images, selectedImageId, usedImageIds, onSelect }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, backgroundColor: '#EFF0F8' } }}
    >
      <DialogTitle sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 1 }}>
        画像を選択
      </DialogTitle>
      <DialogContent>
        {images.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5 }}>
              画像がありません。先に「画像」ページからアップロードしてください。
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 1.5,
              maxHeight: 400,
              overflowY: 'auto',
              py: 1,
            }}
          >
            {images.map((image) => {
              const isSelected = image.id === selectedImageId
              const isUsed = usedImageIds.has(image.id)

              return (
                <Box
                  key={image.id}
                  onClick={isUsed ? undefined : () => { onSelect(image.id); onClose() }}
                  sx={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: isSelected ? '3px solid #3949AB' : '2px solid transparent',
                    cursor: isUsed ? 'not-allowed' : 'pointer',
                    opacity: isUsed ? 0.4 : 1,
                    transition: 'all 0.15s',
                    '&:hover': isUsed ? {} : {
                      borderColor: '#5F6DC2',
                      transform: 'scale(1.03)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image.url}
                    alt=""
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {isSelected && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 22, color: '#3949AB' }} />
                    </Box>
                  )}
                  {isUsed && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(47, 60, 140, 0.75)',
                        py: 0.5,
                        textAlign: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>
                        使用中
                      </Typography>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ fontSize: '13px', color: '#2F3C8C' }}
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  )
}
