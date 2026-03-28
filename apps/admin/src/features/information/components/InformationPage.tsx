import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Tab = 'list' | 'create'

const TABLE_HEAD_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D6D6D6',
}

const TABLE_CELL_SX = {
  fontSize: '13px',
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D6D6D6',
}

export function InformationPage() {
  const [tab, setTab] = useState<Tab>('list')
  const { data: announcements } = useAnnouncements()

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        お知らせ
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              お知らせ一覧
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setTab('create')}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              作成
            </Button>
          </Box>

          {tab === 'list' && (
            <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={TABLE_HEAD_SX}>タグID</TableCell>
                  <TableCell sx={TABLE_HEAD_SX}>名前</TableCell>
                  <TableCell sx={TABLE_HEAD_SX}>内容</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 8, color: '#888', fontSize: '13px' }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((item) => (
                    <TableRow key={item.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                      <TableCell sx={TABLE_CELL_SX}>{item.id}</TableCell>
                      <TableCell sx={TABLE_CELL_SX}>{item.name}</TableCell>
                      <TableCell sx={TABLE_CELL_SX}>{item.content}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
