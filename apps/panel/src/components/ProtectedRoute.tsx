import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const location = useLocation()
  const hasToken = document.cookie.split(";").some((c) => c.trim().startsWith("token="))
  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
