import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"
import AppProviders from "@/components/AppProviders"
import { AppErrorBoundary } from "@/components/layouts/AppErrorBoundary"
import ProtectedRoute from "@/components/ProtectedRoute"
import AuthCallbackPage from "@/pages/AuthCallbackPage"
import LoginPage from "@/pages/LoginPage"
import HomePage from "@/app/page"
import ConfirmPage from "@/app/confirm/page"
import SubmitPage from "@/app/submit/page"
import WeatherPage from "@/app/weather/[type]/page"
import SportPage from "@/app/weather/[type]/sport/[sports]/page"
import TeamPage from "@/app/weather/[type]/sport/[sports]/team/[teams]/page"
import { useAuth } from "@/hooks/useAuth"
import { userManager } from "@/lib/userManager"

function LoginRoute() {
  const { loggedIn, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={32} sx={{ color: "#5F6DC2" }} />
      </Box>
    )
  }

  if (loggedIn) {
    return <Navigate to="/" replace />
  }

  return <LoginPage onLogin={() => userManager.signinRedirect()} />
}

export default function App() {
  console.log("[form] App rendered")
  return (
    <AppProviders>
      <AppErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/api/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/confirm" element={<ConfirmPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/weather/:type" element={<WeatherPage />} />
              <Route path="/weather/:type/sport/:sports" element={<SportPage />} />
              <Route path="/weather/:type/sport/:sports/team/:teams" element={<TeamPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppErrorBoundary>
    </AppProviders>
  )
}
