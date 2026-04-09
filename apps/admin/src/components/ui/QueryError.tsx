import { Box, Button, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

type Props = {
  onRetry?: () => void
}

export function QueryError({ onRetry }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 1.5 }}>
      <ErrorOutlineIcon sx={{ fontSize: 40, color: '#5B6DC6' }} />
      <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C' }}>
        データの取得に失敗しました
      </Typography>
      <Typography sx={{ fontSize: '13px', color: '#5B6DC6', textAlign: 'center', lineHeight: 1.8 }}>
        通信状況をご確認のうえ、再度お試しください。
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          size="small"
          onClick={onRetry}
          sx={{ backgroundColor: '#3949AB', '&:hover': { backgroundColor: '#2F3C8C' }, mt: 1 }}
        >
          再試行する
        </Button>
      )}
    </Box>
  )
}
