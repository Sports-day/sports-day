import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppProviders from "@/components/AppProviders"
import { AppErrorBoundary } from "@/components/layouts/AppErrorBoundary"
import HomePage from "@/app/page"
import ConfirmPage from "@/app/confirm/page"
import SubmitPage from "@/app/submit/page"
import WeatherPage from "@/app/weather/[type]/page"
import SportPage from "@/app/weather/[type]/sport/[sports]/page"
import TeamPage from "@/app/weather/[type]/sport/[sports]/team/[teams]/page"

export default function App() {
  return (
    <AppProviders>
      <AppErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/weather/:type" element={<WeatherPage />} />
            <Route path="/weather/:type/sport/:sports" element={<SportPage />} />
            <Route path="/weather/:type/sport/:sports/team/:teams" element={<TeamPage />} />
          </Routes>
        </BrowserRouter>
      </AppErrorBoundary>
    </AppProviders>
  )
}
