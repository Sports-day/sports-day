import { Component } from 'react'
import type { ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, p: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 48, color: '#5B6DC6' }} />
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C' }}>
            予期しないエラーが発生しました
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#5B6DC6', textAlign: 'center', maxWidth: 400, lineHeight: 1.8 }}>
            ページの表示中に問題が発生しました。<br />
            再試行しても解決しない場合は、管理者にお問い合わせください。
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ error: null })}
            sx={{ backgroundColor: '#3949AB', '&:hover': { backgroundColor: '#2F3C8C' }, mt: 1 }}
          >
            再試行する
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}
