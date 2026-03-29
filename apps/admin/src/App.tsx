import { lazy, Suspense, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader, TOP_HEADER_HEIGHT } from "@/components/layout/TopHeader";
import { PageTransition } from "@/components/layout/PageTransition";

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

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [selected, setSelected] = useState('competitions')
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!loggedIn) {
    return (
      <Suspense fallback={<PageFallback />}>
        {showPrivacy && (
          <PrivacyPolicyPage onClose={() => setShowPrivacy(false)} />
        )}
        <LoginPage
          onLogin={() => setLoggedIn(true)}
          onPrivacy={() => setShowPrivacy(true)}
        />
      </Suspense>
    );
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
      <Suspense fallback={null}>
        {showPrivacy && (
          <PrivacyPolicyPage onClose={() => setShowPrivacy(false)} />
        )}
      </Suspense>
      <TopHeader onMobileMenuToggle={() => setMobileOpen((prev) => !prev)} />
      <Sidebar
        selected={selected}
        onSelect={setSelected}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={() => setLoggedIn(false)}
        onHome={() => setShowPrivacy(true)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${TOP_HEADER_HEIGHT}px`,
          p: { xs: 2, sm: 3 },
          minWidth: 0,
          height: `calc(100vh - ${TOP_HEADER_HEIGHT}px)`,
          overflowY: "auto",
        }}
      >
        <Suspense fallback={<PageFallback />}>
          <PageTransition key={selected}>
            {selected === "competitions" && <CompetitionsPage />}
            {selected === "teams" && <TeamsPage />}
            {selected === "users" && <UsersPage />}
            {selected === "locations" && <LocationsPage />}
            {selected === "permissions" && <PermissionsPage />}
            {selected === "tags" && <TagsPage />}
            {selected === "images" && <ImagesPage />}
            {selected === "active-matches" && <ActiveMatchesPage />}
            {selected === "information" && <InformationPage />}
          </PageTransition>
        </Suspense>
      </Box>
    </Box>
  )
}
