import { useEffect, useState, useSyncExternalStore } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { dismissToast, getToastQueue, subscribeToast } from '@/lib/toast'
import type { ToastType, ToastEntry } from '@/lib/toast'

const STYLE: Record<ToastType, { accent: string; icon: React.ReactNode }> = {
  success: {
    accent: '#3949AB',
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />,
  },
  error: {
    accent: '#D71212',
    icon: <ErrorOutlineIcon sx={{ fontSize: 20 }} />,
  },
  warning: {
    accent: '#E68A00',
    icon: <WarningAmberIcon sx={{ fontSize: 20 }} />,
  },
}

function ToastItem({ entry }: { entry: ToastEntry }) {
  const style = STYLE[entry.type]
  const [progress, setProgress] = useState(100)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const start = entry.createdAt
    const dur = entry.duration
    let raf: number
    const tick = () => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / dur) * 100)
      setProgress(pct)
      if (pct > 0) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [entry.createdAt, entry.duration])

  const handleDismiss = () => {
    setExiting(true)
    setTimeout(() => dismissToast(entry.id), 180)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#EFF0F8',
        borderRadius: 3,
        overflow: 'hidden',
        minWidth: 280,
        maxWidth: 400,
        boxShadow: '0 4px 20px rgba(47, 60, 140, 0.18)',
        animation: exiting ? 'toastOut 0.18s ease forwards' : 'toastIn 0.22s ease',
        '@keyframes toastIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes toastOut': {
          from: { opacity: 1, transform: 'translateY(0)' },
          to: { opacity: 0, transform: 'translateY(8px)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
        <Box sx={{ color: style.accent, display: 'flex', flexShrink: 0 }}>
          {style.icon}
        </Box>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 500, flex: 1, lineHeight: 1.6 }}>
          {entry.message}
        </Typography>
        <IconButton
          size="small"
          onClick={handleDismiss}
          sx={{
            color: '#5B6DC6',
            flexShrink: 0,
            p: 0.5,
            '&:hover': { backgroundColor: 'rgba(91, 109, 198, 0.1)' },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Box sx={{ height: 2, backgroundColor: 'rgba(91, 109, 198, 0.1)' }}>
        <Box
          sx={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: style.accent,
            opacity: 0.4,
            borderRadius: '0 1px 1px 0',
          }}
        />
      </Box>
    </Box>
  )
}

export function GlobalToast() {
  const queue = useSyncExternalStore(subscribeToast, getToastQueue)
  if (queue.length === 0) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {queue.map((t) => (
        <ToastItem key={t.id} entry={t} />
      ))}
    </Box>
  )
}
