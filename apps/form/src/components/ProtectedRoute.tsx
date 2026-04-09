import { Navigate, Outlet } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute() {
  const { loggedIn, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={32} sx={{ color: '#5F6DC2' }} />
      </Box>
    )
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
