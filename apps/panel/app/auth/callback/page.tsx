import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinearProgress, Box, Typography } from '@mui/material'

export default function AuthCallbackPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code')
        if (!code) {
            navigate('/login')
            return
        }

        fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                code,
                redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URL,
            }),
        })
            .then(() => navigate('/'))
            .catch(() => navigate('/login'))
    }, [navigate])

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
            <Typography variant="body1">認証中...</Typography>
            <LinearProgress sx={{ width: 200 }} />
        </Box>
    )
}
