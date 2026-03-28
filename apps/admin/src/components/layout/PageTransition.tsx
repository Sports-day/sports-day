import { Box } from '@mui/material'

type Props = {
  children: React.ReactNode
}

export function PageTransition({ children }: Props) {
  return (
    <Box
      sx={{
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'slideUp 0.25s ease-out',
      }}
    >
      {children}
    </Box>
  )
}
