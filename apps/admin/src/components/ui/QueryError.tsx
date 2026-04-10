import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

type Props = {
  onRetry?: () => void
}

export function QueryError({ onRetry }: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #F5F0FF 0%, #EEF1FB 100%)',
        border: '1px solid #D5D9EF',
        borderRadius: 2,
        my: 2,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 1.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#E8EAF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 28, color: '#5B6DC6' }} />
        </Box>
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
            sx={{
              backgroundColor: '#5F6DC2',
              borderRadius: '20px',
              px: 3,
              mt: 1,
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#3949AB', boxShadow: 'none' },
            }}
          >
            再試行する
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
