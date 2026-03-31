import { Box, Button, Typography } from '@mui/material'

type Props = {
  onLogin: () => void
  onPrivacy: () => void
}

export default function LoginPage({ onLogin, onPrivacy }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #EFF0F8, #C6CBEC)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {/* ロゴ */}
        <Box component="img" src="/logo_admin.png" alt="SPORTSDAY Admin" sx={{ height: 14, objectFit: 'contain', mb: 1, filter: 'brightness(0) saturate(100%) invert(21%) sepia(62%) saturate(714%) hue-rotate(203deg) brightness(96%)' }} />

        {/* サブタイトル */}
        <Typography sx={{ fontSize: '14px', color: '#2F3C8C', mb: 3 }}>
          球技大会の進行管理アプリケーション
        </Typography>

        {/* ログインボタン */}
        <Button
          fullWidth
          variant="contained"
          onClick={onLogin}
          sx={{
            backgroundColor: '#2B3170',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 500,
            height: 50,
            borderRadius: 1,
            boxShadow: 'none',
            mb: 1.5,
            '&:hover': { backgroundColor: '#222860', boxShadow: 'none' },
          }}
        >
          ログイン
        </Button>

        {/* プライバシーポリシーボタン */}
        <Button
          fullWidth
          variant="contained"
          onClick={onPrivacy}
          sx={{
            backgroundColor: '#E6E9F5',
            color: '#2F3C8C',
            fontSize: '14px',
            fontWeight: 400,
            height: 46,
            borderRadius: 1,
            boxShadow: 'none',
            mb: 2,
            '&:hover': { backgroundColor: '#D8DCF0', boxShadow: 'none' },
          }}
        >
          プライバシーポリシー
        </Button>

        {/* Cookie注記 */}
        <Typography sx={{ fontSize: '11px', color: '#8490C8', mb: 1.5 }}>
          SPORTSDAYを使うにはCookieが必要です
        </Typography>

        {/* コピーライト */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '11px', color: '#8490C8' }}>(C)2026 WIDER</Typography>
        </Box>
      </Box>
    </Box>
  )
}
