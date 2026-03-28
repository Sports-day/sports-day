import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export const TOP_HEADER_HEIGHT = 54

type TopHeaderProps = {
  onMobileMenuToggle?: () => void
}

export function TopHeader({ onMobileMenuToggle }: TopHeaderProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: TOP_HEADER_HEIGHT,
        zIndex: 1201,
        background: 'linear-gradient(to right, #C0C6E9 0%, #CBD0EA 100%)',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 1,
      }}
    >
      <IconButton
        onClick={onMobileMenuToggle}
        sx={{ display: { xs: 'flex', md: 'none' }, color: '#2F3C8C', mr: 0.5 }}
      >
        <MenuIcon />
      </IconButton>
      <Box component="img" src="/logo_admin.png" alt="SPORTSDAY Admin" sx={{ height: 14, objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(21%) sepia(62%) saturate(714%) hue-rotate(203deg) brightness(96%)' }} />
    </Box>
  )
}
