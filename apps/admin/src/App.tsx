import { useState } from "react";
import { Box } from "@mui/material";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader, TOP_HEADER_HEIGHT } from "@/components/layout/TopHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import LoginPage from "@/pages/LoginPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import CompetitionsPage from "@/pages/CompetitionsPage";
import TeamsPage from "@/pages/TeamsPage";
import UsersPage from "@/pages/UsersPage";
import LocationsPage from "@/pages/LocationsPage";
import PermissionsPage from "@/pages/PermissionsPage";
import TagsPage from "@/pages/TagsPage";
import ImagesPage from "@/pages/ImagesPage";
import ActiveMatchesPage from "@/pages/ActiveMatchesPage";
import InformationPage from "@/pages/InformationPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [selected, setSelected] = useState("competitions");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!loggedIn) {
    return (
      <>
        {showPrivacy && (
          <PrivacyPolicyPage onClose={() => setShowPrivacy(false)} />
        )}
        <LoginPage
          onLogin={() => setLoggedIn(true)}
          onPrivacy={() => setShowPrivacy(true)}
        />
      </>
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
      {showPrivacy && (
        <PrivacyPolicyPage onClose={() => setShowPrivacy(false)} />
      )}
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
      </Box>
    </Box>
  );
}
