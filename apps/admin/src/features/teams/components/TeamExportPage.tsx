import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useTeamExport } from '../hooks/useTeamExport'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onBack: () => void
}

export function TeamExportPage({ onBack }: Props) {
  const { selectedTag, setSelectedTag, allTags, handleExport } = useTeamExport()

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Typography
          component="span"
          onClick={onBack}
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
        >
          チーム
        </Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>/</Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          チームデータのエクスポート
        </Typography>
      </Box>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            競技の情報
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel shrink sx={{ color: '#2F3C8C' }}>チームタグ</InputLabel>
            <Select
              value={selectedTag}
              label="チームタグ"
              notched
              displayEmpty
              onChange={(e) => setSelectedTag(e.target.value)}
              renderValue={(value) =>
                value ? (
                  <Typography sx={{ fontSize: '14px', color: '#2F3C8C' }}>{value}</Typography>
                ) : (
                  <Typography sx={{ fontSize: '14px', color: 'rgba(47, 60, 140, 0.7)' }}>チームタグを選択してください</Typography>
                )
              }
              sx={{
                backgroundColor: 'transparent',
                color: '#2F3C8C',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6' },
              }}
            >
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleExport}
            sx={{ ...SAVE_BUTTON_SX }}
          >
            エクスポート
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
