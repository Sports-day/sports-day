import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinearProgress, Box, Typography } from '@mui/material'
import { gql, useMutation } from '@apollo/client'

const LOGIN_MUTATION = gql`
  mutation Login($code: String!, $redirectURL: String!) {
    login(input: { code: $code, redirectURL: $redirectURL }) {
      token
    }
  }
`

export default function AuthCallbackPage() {
    const navigate = useNavigate()
    const [login] = useMutation(LOGIN_MUTATION)

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code')
        if (!code) {
            navigate('/login')
            return
        }

        const redirectURL = import.meta.env.VITE_OIDC_REDIRECT_URL

        login({ variables: { code, redirectURL } })
            .then(({ data }) => {
                const token = data?.login?.token
                if (token) {
                    document.cookie = `token=${token}; path=/`
                }
                navigate('/', { replace: true })
            })
            .catch(() => navigate('/login'))
    }, [navigate, login])

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
            <Typography variant="body1">認証中...</Typography>
            <LinearProgress sx={{ width: 200 }} />
        </Box>
    )
}
