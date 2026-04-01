import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "@/app/(auth)/login/page"
import DashboardPage from "@/app/(authenticated)/page"
import AboutPage from "@/app/(authenticated)/about/page"
import DiscoverPage from "@/app/(authenticated)/discover/page"
import PrivacyPage from "@/app/(authenticated)/privacy/page"
import SportsPage from "@/app/(authenticated)/sports/[id]/page"
import AuthenticatedLayout from "@/app/(authenticated)/layout"
import InformationListPage from "@/app/(information)/information/page"
import InformationDetailPage from "@/app/(information)/information/[id]/page"
import AuthCallbackPage from "@/app/auth/callback/page"
import OfflinePage from "@/app/offline/page"
import NotFoundPage from "@/app/not-found"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/offline" element={<OfflinePage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/sports/:id" element={<SportsPage />} />
        </Route>
      </Route>

      <Route path="/information" element={<InformationListPage />} />
      <Route path="/information/:id" element={<InformationDetailPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
