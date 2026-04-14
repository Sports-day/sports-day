import { lazy, Suspense, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader, TOP_HEADER_HEIGHT_XS, TOP_HEADER_HEIGHT_MD } from "@/components/layout/TopHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { GlobalToast } from "@/components/ui/GlobalToast";
import { registerNavigate } from "@/hooks/useAppNavigation";
import { ResetToListContext } from "@/hooks/useResetToList";
import { useAuth } from "@/hooks/useAuth";
import { CurrentUserContext, useCurrentUserQuery } from "@/hooks/useCurrentUser";
import { checkSidebarPermission } from "@/lib/permissions";
import { userManager } from "@/lib/userManager";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const AuthCallbackPage = lazy(() => import("@/pages/AuthCallbackPage"));
const CompetitionsPage = lazy(() => import("@/pages/CompetitionsPage"));
const CompetitionNewPage = lazy(() => import("@/pages/CompetitionNewPage"));
const CompetitionDetailPage = lazy(() => import("@/pages/CompetitionDetailPage"));
const SportsPage = lazy(() => import("@/pages/SportsPage"));
const SportNewPage = lazy(() => import("@/pages/SportNewPage"));
const SportDetailPage = lazy(() => import("@/pages/SportDetailPage"));
const TeamsPage = lazy(() => import("@/pages/TeamsPage"));
const TeamNewPage = lazy(() => import("@/pages/TeamNewPage"));
const TeamDetailPage = lazy(() => import("@/pages/TeamDetailPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const UserCsvPage = lazy(() => import("@/pages/UserCsvPage"));
const UserDetailPage = lazy(() => import("@/pages/UserDetailPage"));
const LocationsPage = lazy(() => import("@/pages/LocationsPage"));
const LocationNewPage = lazy(() => import("@/pages/LocationNewPage"));
const LocationDetailPage = lazy(() => import("@/pages/LocationDetailPage"));
const ClassesPage = lazy(() => import("@/pages/ClassesPage"));
const ClassNewPage = lazy(() => import("@/pages/ClassNewPage"));
const ClassDetailPage = lazy(() => import("@/pages/ClassDetailPage"));
const TagsPage = lazy(() => import("@/pages/TagsPage"));
const TagNewPage = lazy(() => import("@/pages/TagNewPage"));
const TagDetailPage = lazy(() => import("@/pages/TagDetailPage"));
const ImagesPage = lazy(() => import("@/pages/ImagesPage"));
const ImageNewPage = lazy(() => import("@/pages/ImageNewPage"));
const ImageDetailPage = lazy(() => import("@/pages/ImageDetailPage"));
const ActiveMatchesPage = lazy(() => import("@/pages/ActiveMatchesPage"));
const InformationPage = lazy(() => import("@/pages/InformationPage"));
const InformationNewPage = lazy(() => import("@/pages/InformationNewPage"));
const InformationDetailPage = lazy(() => import("@/pages/InformationDetailPage"));

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
  const { loggedIn, loading } = useAuth()
  const { currentUser, loading: meLoading } = useCurrentUserQuery()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    registerNavigate((page: string, params?: Record<string, string>) => {
      // 大会詳細へのディープリンク（試合ページからの戻り先など）
      if (page === 'competitions' && params?.competitionId) {
        const { competitionId, competitionName = '', type = 'TOURNAMENT' } = params
        navigate(`/competitions/${competitionId}?type=${type}&name=${encodeURIComponent(competitionName)}`)
        return
      }
      const path = keyToPath(page)
      if (params && Object.keys(params).length > 0) {
        const search = new URLSearchParams(params).toString()
        navigate(`${path}?${search}`)
      } else {
        navigate(path)
      }
    })
  }, [navigate])

  if (loading || meLoading) return <PageFallback />

  // 未ログインならログインページへリダイレクト
  if (!loggedIn) {
    return <Navigate to="/login" replace />
  }

  const selected = pathToKey(location.pathname)

  const handleSidebarSelect = (key: string) => {
    const path = keyToPath(key)
    if (location.pathname === path) {
      // 一覧ページで同じメニューを再クリック → stateベースページ用リセット（試合ページ等）
      setResetKey((k) => k + 1)
    } else {
      navigate(path)
    }
  }

  const handleLogout = () => {
    userManager.signoutRedirect().catch(() => {
      userManager.removeUser().then(() => navigate("/login"))
    })
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
        onSelect={handleSidebarSelect}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        onHome={onPrivacy}
        checkPermission={currentUser ? (key) => checkSidebarPermission(currentUser.role, key) : undefined}
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
            <CurrentUserContext.Provider value={{ currentUser, loading: meLoading }}>
              <ResetToListContext.Provider value={resetKey}>
                <Routes>
                  <Route path="/competitions" element={<CompetitionsPage />} />
                  <Route path="/competitions/new" element={<CompetitionNewPage />} />
                  <Route path="/competitions/:id" element={<CompetitionDetailPage />} />
                  <Route path="/sports" element={<SportsPage />} />
                  <Route path="/sports/new" element={<SportNewPage />} />
                  <Route path="/sports/:id" element={<SportDetailPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/teams/new" element={<TeamNewPage />} />
                  <Route path="/teams/:id" element={<TeamDetailPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/csv" element={<UserCsvPage />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                  <Route path="/locations/new" element={<LocationNewPage />} />
                  <Route path="/locations/:id" element={<LocationDetailPage />} />
                  <Route path="/classes" element={<ClassesPage />} />
                  <Route path="/classes/new" element={<ClassNewPage />} />
                  <Route path="/classes/:id" element={<ClassDetailPage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/tags/new" element={<TagNewPage />} />
                  <Route path="/tags/:id" element={<TagDetailPage />} />
                  <Route path="/images" element={<ImagesPage />} />
                  <Route path="/images/new" element={<ImageNewPage />} />
                  <Route path="/images/:id" element={<ImageDetailPage />} />
                  <Route path="/active-matches" element={<ActiveMatchesPage />} />
                  <Route path="/information" element={<InformationPage />} />
                  <Route path="/information/new" element={<InformationNewPage />} />
                  <Route path="/information/:id" element={<InformationDetailPage />} />
                  <Route path="*" element={<Navigate to="/competitions" replace />} />
                </Routes>
              </ResetToListContext.Provider>
            </CurrentUserContext.Provider>
          </Suspense>
        </ErrorBoundary>
      </Box>
      <GlobalToast />
    </Box>
  )
}

function LoginRoute({ onPrivacy }: { onPrivacy: () => void }) {
  const { loggedIn, loading } = useAuth()

  if (loading) return <PageFallback />

  if (loggedIn) {
    return <Navigate to="/competitions" replace />
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <LoginPage
        onLogin={() => userManager.signinRedirect()}
        onPrivacy={onPrivacy}
      />
    </Suspense>
  )
}

export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Suspense fallback={null}>
        {showPrivacy && (
          <PrivacyPolicyPage onClose={() => setShowPrivacy(false)} />
        )}
      </Suspense>
      <Routes>
        <Route path="/login" element={<LoginRoute onPrivacy={() => setShowPrivacy(true)} />} />
        <Route
          path="/api/auth/callback"
          element={
            <Suspense fallback={<PageFallback />}>
              <AuthCallbackPage />
            </Suspense>
          }
        />
        <Route path="/*" element={<AppShell onPrivacy={() => setShowPrivacy(true)} />} />
      </Routes>
    </BrowserRouter>
  )
}
