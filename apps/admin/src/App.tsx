import { lazy, Suspense, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader, TOP_HEADER_HEIGHT_XS, TOP_HEADER_HEIGHT_MD } from "@/components/layout/TopHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { GlobalToast } from "@/components/ui/GlobalToast";
import { registerNavigate } from "@/hooks/useAppNavigation";
import { useAuth } from "@/hooks/useAuth";
import { login, logout, hasPermission } from "@/lib/auth";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const CompetitionsPage = lazy(() => import("@/pages/CompetitionsPage"));
const TeamsPage = lazy(() => import("@/pages/TeamsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const LocationsPage = lazy(() => import("@/pages/LocationsPage"));
const PermissionsPage = lazy(() => import("@/pages/PermissionsPage"));
const TagsPage = lazy(() => import("@/pages/TagsPage"));
const ImagesPage = lazy(() => import("@/pages/ImagesPage"));
const ActiveMatchesPage = lazy(() => import("@/pages/ActiveMatchesPage"));
const InformationPage = lazy(() => import("@/pages/InformationPage"));

function PageFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <CircularProgress size={32} sx={{ color: "#5F6DC2" }} />
    </Box>
  );
}

function pathToKey(pathname: string): string {
  return pathname.split("/").filter(Boolean)[0] ?? "competitions"
}

function keyToPath(key: string): string {
  return `/${key}`
}

function AppShell({ onPrivacy }: { onPrivacy: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { loggedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // 未ログインならログインページへリダイレクト
  if (!loggedIn) {
    return <Navigate to="/login" replace />
  }

  const selected = pathToKey(location.pathname)

  useEffect(() => {
    registerNavigate((page: string) => navigate(keyToPath(page)))
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      <TopHeader onMobileMenuToggle={() => setMobileOpen((prev) => !prev)} />
      <Sidebar
        selected={selected}
        onSelect={(key) => navigate(keyToPath(key))}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        onHome={onPrivacy}
        checkPermission={hasPermission}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: `${TOP_HEADER_HEIGHT_XS}px`, md: `${TOP_HEADER_HEIGHT_MD}px` },
          p: { xs: 2, sm: 3 },
          minWidth: 0,
          height: { xs: `calc(100vh - ${TOP_HEADER_HEIGHT_XS}px)`, md: `calc(100vh - ${TOP_HEADER_HEIGHT_MD}px)` },
          overflowY: "auto",
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/competitions" element={<CompetitionsPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/permissions" element={<PermissionsPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/images" element={<ImagesPage />} />
              <Route path="/active-matches" element={<ActiveMatchesPage />} />
              <Route path="/information" element={<InformationPage />} />
              <Route path="*" element={<Navigate to="/competitions" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Box>
      <GlobalToast />
    </Box>
  )
}

function LoginRoute({ onPrivacy }: { onPrivacy: () => void }) {
  const navigate = useNavigate()
  const { loggedIn } = useAuth()

  if (loggedIn) {
    return <Navigate to="/competitions" replace />
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <LoginPage
        onLogin={() => { login(); navigate("/competitions") }}
        onPrivacy={onPrivacy}
      />
    </Suspense>
  )
}

export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        {showPrivacy && (
          <PrivacyPolicyPage onClose={() => setShowPrivacy(false)} />
        )}
      </Suspense>
      <Routes>
        <Route path="/login" element={<LoginRoute onPrivacy={() => setShowPrivacy(true)} />} />
        <Route path="/*" element={<AppShell onPrivacy={() => setShowPrivacy(true)} />} />
      </Routes>
    </BrowserRouter>
  )
}
