import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const location = useLocation()
  // TODO: 開発中は認証スキップ。本番前に元に戻すこと
  // const hasToken = document.cookie.split(";").some((c) => c.trim().startsWith("access_token="))
  // if (!hasToken) {
  //   return <Navigate to="/login" state={{ from: location }} replace />
  // }

  return <Outlet />
}
