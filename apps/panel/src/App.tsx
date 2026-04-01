import { BrowserRouter } from "react-router-dom"
import { CssBaseline } from "@mui/material"
import ColorModeProvider from "@/components/theme/colorModeProvider"
import { ApolloProvider } from "@/src/components/ApolloProvider"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { AppRoutes } from "./routes"

export default function App() {
  return (
    <ColorModeProvider>
      <CssBaseline />
      <ApolloProvider>
        <BrowserRouter>
          <AppRoutes />
          <GoogleAnalytics />
        </BrowserRouter>
      </ApolloProvider>
    </ColorModeProvider>
  )
}
