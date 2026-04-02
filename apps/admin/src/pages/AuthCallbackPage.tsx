import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinearProgress, Box, Typography } from '@mui/material'
import { userManager } from '@/lib/userManager'

export default function AuthCallbackPage() {
  const isRunning = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (window.self !== window.top) {
      userManager.signinSilentCallback()
      return
    }
    if (isRunning.current) return
    isRunning.current = true

    userManager.signinRedirectCallback()
      .then(() => navigate('/competitions', { replace: true }))
      .catch(() => navigate('/login'))
  }, [navigate])

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
      <Typography variant="body1">認証を処理中...</Typography>
      <LinearProgress sx={{ width: 200 }} />
    </Box>
  )
}
