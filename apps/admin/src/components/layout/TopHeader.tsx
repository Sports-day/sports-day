import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import logoAdmin from '@/assets/logo_admin.png'

/** レスポンシブ対応: xs=64, md=72 */
export const TOP_HEADER_HEIGHT = { xs: 64, md: 72 } as const
export const TOP_HEADER_HEIGHT_XS = 48
export const TOP_HEADER_HEIGHT_MD = 56

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
        minHeight: { xs: TOP_HEADER_HEIGHT_XS, md: TOP_HEADER_HEIGHT_MD },
        zIndex: 1201,
        background: 'linear-gradient(to right, #C0C6E9 0%, #CBD0EA 100%)',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        gap: 1,
      }}
    >
      <IconButton
        onClick={onMobileMenuToggle}
        sx={{ display: { xs: 'flex', md: 'none' }, color: '#2F3C8C', mr: 0.5 }}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="img"
        src={logoAdmin}
        alt="SPORTSDAY Admin"
        sx={{
          width: 'clamp(110px, 17.5vw, 220px)',
          height: 'auto',
          objectFit: 'contain',
          filter: 'brightness(0) saturate(100%) invert(21%) sepia(62%) saturate(714%) hue-rotate(203deg) brightness(96%)',
        }}
      />
    </Box>
  )
}
