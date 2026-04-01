import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material'
import { TOP_HEADER_HEIGHT } from './TopHeader'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LabelIcon from '@mui/icons-material/Label'
import ImageIcon from '@mui/icons-material/Image'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import CampaignIcon from '@mui/icons-material/Campaign'
import LogoutIcon from '@mui/icons-material/Logout'
import GitHubIcon from '@mui/icons-material/GitHub'
import HomeIcon from '@mui/icons-material/Home'
import { COLOR_BG_SIDEBAR, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT } from '@/styles/colors'
import { GITHUB_URL } from '@/lib/constants'

export const DRAWER_WIDTH = 250

type NavItem = {
  key: string
  label: string
  icon: React.ReactNode
  /** このページを表示するために必要な権限キー。省略=常に表示 */
  permission?: string
}

const PREPARATION_ITEMS: NavItem[] = [
  { key: 'competitions', label: '競技', icon: <EmojiEventsIcon fontSize="small" />, permission: 'competitions.view' },
  { key: 'teams', label: 'チーム', icon: <GroupsIcon fontSize="small" />, permission: 'teams.view' },
  { key: 'users', label: 'ユーザー', icon: <PersonIcon fontSize="small" />, permission: 'users.view' },
  { key: 'locations', label: '場所', icon: <LocationOnIcon fontSize="small" />, permission: 'locations.view' },
  { key: 'permissions', label: '権限', icon: <AdminPanelSettingsIcon fontSize="small" />, permission: 'roles.view' },
  { key: 'tags', label: 'タグ', icon: <LabelIcon fontSize="small" />, permission: 'tags.edit' },
  { key: 'images', label: '画像', icon: <ImageIcon fontSize="small" />, permission: 'images.view' },
]

const PROGRESS_ITEMS: NavItem[] = [
  { key: 'active-matches', label: '試合', icon: <PlayCircleIcon fontSize="small" />, permission: 'matches.view' },
  { key: 'information', label: 'お知らせ', icon: <CampaignIcon fontSize="small" />, permission: 'information.view' },
]

const NAV_ITEM_SX = (selected: boolean) => ({
  borderRadius: 1,
  mb: 1,
  gap: 1.5,
  width: 220,
  height: 45,
  px: 1.5,
  backgroundColor: 'rgba(233, 234, 242, 0.7)',
  border: 'none',
  boxShadow: 'none',
  '&:hover': { backgroundColor: 'rgba(223, 224, 236, 0.7)', boxShadow: 'none' },
  '&.Mui-selected': {
    backgroundColor: 'rgba(198, 200, 216, 0.7)',
    boxShadow: 'none',
    '&:hover': { backgroundColor: 'rgba(198, 200, 216, 0.7)', boxShadow: 'none' },
  },
  '& .MuiListItemText-primary': {
    opacity: selected ? 1 : 0.6,
    fontWeight: selected ? 700 : 400,
  },
})

type SidebarProps = {
  selected: string
  onSelect: (key: string) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
  onLogout?: () => void
  onHome?: () => void
  /** 権限チェック関数。渡すと権限のないメニューが非表示になる */
  checkPermission?: (key: string) => boolean
}

export function Sidebar({ selected, onSelect, mobileOpen = false, onMobileClose, onLogout, onHome, checkPermission }: SidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleSelect = (key: string) => {
    onSelect(key)
    if (isMobile && onMobileClose) onMobileClose()
  }

  const content = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        backgroundColor: COLOR_BG_SIDEBAR,
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100%' : `calc(100% - ${TOP_HEADER_HEIGHT}px)`,
        mt: isMobile ? 0 : `${TOP_HEADER_HEIGHT}px`,
        overflow: 'hidden',
      }}
    >
      <Divider />

      <Typography sx={{ px: 1.875, pt: 1.5, pb: 0.5, fontSize: '16px', fontWeight: 700, color: COLOR_PRIMARY_DARK, opacity: 0.55, letterSpacing: '0.08em' }}>
        準備
      </Typography>
      <List dense disablePadding aria-label="メインナビゲーション" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {PREPARATION_ITEMS.filter(({ permission }) => !permission || !checkPermission || checkPermission(permission)).map(({ key, label, icon }) => (
          <ListItemButton
            key={key}
            selected={selected === key}
            onClick={() => handleSelect(key)}
            sx={NAV_ITEM_SX(selected === key)}
          >
            <Box sx={{ color: COLOR_PRIMARY_LIGHT, display: 'flex', alignItems: 'center' }}>{icon}</Box>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: '14px', color: COLOR_PRIMARY_DARK }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mt: 1 }} />

      <Typography sx={{ px: 1.875, pt: 1.5, pb: 0.5, fontSize: '16px', fontWeight: 700, color: COLOR_PRIMARY_DARK, opacity: 0.55, letterSpacing: '0.08em' }}>
        進行
      </Typography>
      <List dense disablePadding aria-label="進行ナビゲーション" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {PROGRESS_ITEMS.filter(({ permission }) => !permission || !checkPermission || checkPermission(permission)).map(({ key, label, icon }) => (
          <ListItemButton
            key={key}
            selected={selected === key}
            onClick={() => handleSelect(key)}
            sx={NAV_ITEM_SX(selected === key)}
          >
            <Box sx={{ color: COLOR_PRIMARY_LIGHT, display: 'flex', alignItems: 'center' }}>{icon}</Box>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: '14px', color: COLOR_PRIMARY_DARK }} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ px: 1, pt: 0.5, display: 'flex', gap: 3, justifyContent: 'center' }}>
          <IconButton sx={{ color: COLOR_PRIMARY_LIGHT, opacity: 0.7 }} onClick={onLogout}>
            <LogoutIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <IconButton sx={{ color: COLOR_PRIMARY_LIGHT, opacity: 0.7 }} onClick={() => window.open(GITHUB_URL, '_blank')}>
            <GitHubIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <IconButton sx={{ color: COLOR_PRIMARY_LIGHT, opacity: 0.7 }} onClick={onHome}>
            <HomeIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>
        <Box sx={{ px: 2, pt: 1.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '10px', color: COLOR_PRIMARY_DARK, opacity: 0.7 }}>
            (C){new Date().getFullYear()}
          </Typography>
          {/* 画像スペース */}
        </Box>
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        transitionDuration={0}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            overflow: 'hidden',
          },
        }}
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      }}
    >
      {content}
    </Drawer>
  )
}
