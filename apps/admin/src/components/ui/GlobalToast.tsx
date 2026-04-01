import { useSyncExternalStore } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { dismissToast, getToastQueue, subscribeToast } from '@/lib/toast'

export function GlobalToast() {
  const queue = useSyncExternalStore(subscribeToast, getToastQueue)
  if (queue.length === 0) return null

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {queue.map((t) => (
        <Box
          key={t.id}
          sx={{
            backgroundColor: '#52598D',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            minWidth: 260,
            animation: 'fadeIn 0.2s ease',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography sx={{ fontSize: '13px', color: '#fff', fontWeight: 500, flex: 1 }}>
            {t.message}
          </Typography>
          <IconButton
            size="small"
            onClick={() => dismissToast(t.id)}
            sx={{ color: '#fff', flexShrink: 0, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}
