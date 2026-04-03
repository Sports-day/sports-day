import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import App from './App.tsx'
import { ApolloProvider } from '@/components/ApolloProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
)
