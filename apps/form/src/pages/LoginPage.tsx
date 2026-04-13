import { Box, Button, Typography, Stack, useTheme } from '@mui/material'
import PrivacyPolicyDrawer from '@/components/layouts/PrivacyPolicyDrawer'
import logoForm from '@/assets/logo_form.png'
import widerHoriz from '@/assets/wider_horiz.png'

type Props = {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: Props) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          px: '16px',
          py: '16px',
        }}
      >
        <img
          src={logoForm}
          alt=""
          width={380}
          height={30}
          style={{ width: 'min(380px, 78vw)', height: 'auto' }}
        />
        <Typography
          sx={{
            color: 'white',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          球技大会のチーム登録プラットフォーム
        </Typography>

        <Box sx={{ width: 'min(320px, 100%)', mt: '32px' }}>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            onClick={onLogin}
            sx={{
              width: '100%',
              background: theme.palette.button.veryLight,
              borderRadius: '10px',
              '&:hover': {
                background: theme.palette.button.veryLight,
                borderRadius: '10px',
                opacity: 0.9,
              },
            }}
          >
            <Typography
              sx={(theme) => ({
                ...theme.typography.buttonFont2,
              })}
            >
              ログイン
            </Typography>
          </Button>
        </Box>
        <Box sx={{ width: 'min(320px, 100%)', mt: '16px' }}>
          <PrivacyPolicyDrawer>プライバシーポリシー</PrivacyPolicyDrawer>
        </Box>

        <Stack direction="row" spacing={'8px'} sx={{ mt: '32px' }}>
          <Typography
            sx={{
              color: 'white',
              opacity: 0.3,
              fontSize: '20px',
              lineHeight: 1,
            }}
          >
            (C)
          </Typography>
          <Box>
            <img
              src={widerHoriz}
              alt=""
              width={160}
              height={48}
              style={{
                opacity: 0.3,
                width: 'min(160px, 44vw)',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
