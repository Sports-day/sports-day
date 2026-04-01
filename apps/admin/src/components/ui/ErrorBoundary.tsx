import { Component } from 'react'
import type { ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, p: 4 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C' }}>
            エラーが発生しました
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#5B6DC6', textAlign: 'center', maxWidth: 400 }}>
            {this.state.error.message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ error: null })}
            sx={{ backgroundColor: '#3949AB', '&:hover': { backgroundColor: '#2F3C8C' } }}
          >
            再試行
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}
