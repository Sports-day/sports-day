import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import SportsIcon from '@mui/icons-material/Sports'
import NotificationsIcon from '@mui/icons-material/Notifications'

const DRAWER_WIDTH = 250

const navItems = [
  { label: 'ダッシュボード', icon: <DashboardIcon sx={{ color: '#4A5ABB' }} /> },
  { label: 'ユーザー管理', icon: <PeopleIcon sx={{ color: '#4A5ABB' }} /> },
  { label: 'スポーツ管理', icon: <SportsIcon sx={{ color: '#4A5ABB' }} /> },
  { label: '設定', icon: <SettingsIcon sx={{ color: '#4A5ABB' }} /> },
]

export default function App() {
  const [selected, setSelected] = useState('ダッシュボード')

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* サイドバー */}
      <Drawer variant="permanent" anchor="left">
        <Box sx={{ p: 2 }}>
          <Typography variant="h1" sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C' }}>
            Admin Panel
          </Typography>
        </Box>
        <Divider />
        <List sx={{ mt: 1 }}>
          {navItems.map(({ label, icon }) => (
            <ListItemButton
              key={label}
              selected={selected === label}
              onClick={() => setSelected(label)}
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#D6D6D6',
                  '& .MuiListItemText-primary': { opacity: 0.3 },
                },
              }}
            >
              <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: '16px' }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{ flexGrow: 1, ml: `${DRAWER_WIDTH}px`, p: 3 }}
      >
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Breadcrumbs>
            <Link href="#" underline="hover" color="inherit" sx={{ fontSize: '16px' }}>ホーム</Link>
            <Link href="#" underline="hover" color="inherit" sx={{ fontSize: '16px' }}>{selected}</Link>
            <Typography sx={{ fontSize: '16px', color: 'text.primary' }}>一覧</Typography>
          </Breadcrumbs>
          <IconButton>
            <NotificationsIcon sx={{ color: '#4A5ABB' }} />
          </IconButton>
        </Box>

        {/* ページタイトル */}
        <Typography variant="h1" sx={{ mb: 3 }}>{selected}</Typography>

        {/* サマリーカード */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {[
            { label: '総ユーザー数', value: '128' },
            { label: '登録チーム数', value: '16' },
            { label: '開催競技数', value: '8' },
          ].map(({ label, value }) => (
            <Card key={label} sx={{ flex: 1, backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 1 }}>{label}</Typography>
                <Card sx={{ backgroundColor: '#5B6DC6', p: 1 }}>
                  <Typography variant="h1" sx={{ color: '#2F3C8C', textAlign: 'center' }}>
                    {value}
                  </Typography>
                </Card>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* テーブル風カード */}
        <Card sx={{ backgroundColor: 'background.paper', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h1">ユーザー一覧</Typography>
              <Button variant="contained">新規追加</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {['田中 太郎', '佐藤 花子', '鈴木 一郎'].map((name) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid #C9CEEA',
                }}
              >
                <Typography variant="body1">{name}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" size="small">保存</Button>
                  <Button variant="outlined" color="error" size="small">削除</Button>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
