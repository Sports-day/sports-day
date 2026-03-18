import { Box, Divider, IconButton, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LabelIcon from '@mui/icons-material/Label'
import ImageIcon from '@mui/icons-material/Image'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CampaignIcon from '@mui/icons-material/Campaign'
import LogoutIcon from '@mui/icons-material/Logout'
import GitHubIcon from '@mui/icons-material/GitHub'

export const DRAWER_WIDTH = 250

type NavItem = {
  key: string
  label: string
  icon: React.ReactNode
}

const PREPARATION_ITEMS: NavItem[] = [
  { key: 'competitions', label: '競技', icon: <EmojiEventsIcon fontSize="small" /> },
  { key: 'teams', label: 'チーム', icon: <GroupsIcon fontSize="small" /> },
  { key: 'users', label: 'ユーザー', icon: <PersonIcon fontSize="small" /> },
  { key: 'locations', label: '場所', icon: <LocationOnIcon fontSize="small" /> },
  { key: 'permissions', label: '権限', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { key: 'tags', label: 'タグ', icon: <LabelIcon fontSize="small" /> },
  { key: 'images', label: '画像', icon: <ImageIcon fontSize="small" /> },
]

const PROGRESS_ITEMS: NavItem[] = [
  { key: 'active-matches', label: '進行中の試合', icon: <PlayCircleIcon fontSize="small" /> },
  { key: 'finished-matches', label: '終了した試合', icon: <CheckCircleIcon fontSize="small" /> },
  { key: 'information', label: 'お知らせ', icon: <CampaignIcon fontSize="small" /> },
]

const NAV_ITEM_SX = (selected: boolean) => ({
  borderRadius: 1,
  mb: 0.5,
  gap: 1.5,
  width: '100%',
  height: 50,
  px: 1.5,
  backgroundColor: '#EFF0F8',
  border: 'none',
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#E5E6F0', boxShadow: 'none' },
  '&.Mui-selected': {
    backgroundColor: '#C6C8D8',
    boxShadow: 'none',
    '&:hover': { backgroundColor: '#C6C8D8', boxShadow: 'none' },
  },
  '& .MuiListItemText-primary': {
    opacity: selected ? 0.4 : 1,
  },
})

type SidebarProps = {
  selected: string
  onSelect: (key: string) => void
}

export function Sidebar({ selected, onSelect }: SidebarProps) {
  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        backgroundColor: '#D9DCED',
        borderRight: '1px solid #5F6DC2',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <Box sx={{ px: 1, py: 2 }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C' }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      <Typography sx={{ px: 1, pt: 1.5, pb: 0.5, fontSize: '11px', fontWeight: 700, color: '#2F3C8C', opacity: 0.55, letterSpacing: '0.08em' }}>
        準備
      </Typography>
      <List dense disablePadding sx={{ px: 1 }}>
        {PREPARATION_ITEMS.map(({ key, label, icon }) => (
          <ListItemButton
            key={key}
            selected={selected === key}
            onClick={() => onSelect(key)}
            sx={NAV_ITEM_SX(selected === key)}
          >
            <Box sx={{ color: '#4A5ABB', display: 'flex', alignItems: 'center' }}>{icon}</Box>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: '14px', color: '#2F3C8C' }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mt: 1 }} />

      <Typography sx={{ px: 1, pt: 1.5, pb: 0.5, fontSize: '11px', fontWeight: 700, color: '#2F3C8C', opacity: 0.55, letterSpacing: '0.08em' }}>
        進行
      </Typography>
      <List dense disablePadding sx={{ px: 1 }}>
        {PROGRESS_ITEMS.map(({ key, label, icon }) => (
          <ListItemButton
            key={key}
            selected={selected === key}
            onClick={() => onSelect(key)}
            sx={NAV_ITEM_SX(selected === key)}
          >
            <Box sx={{ color: '#4A5ABB', display: 'flex', alignItems: 'center' }}>{icon}</Box>
            <ListItemText primary={label} primaryTypographyProps={{ fontSize: '14px', color: '#2F3C8C' }} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 1, pt: 0.5, display: 'flex', gap: 0.5 }}>
        <IconButton size="small" sx={{ color: '#4A5ABB' }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: '#4A5ABB' }}>
          <GitHubIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}
