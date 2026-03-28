import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { MOCK_LOCATIONS } from '@/features/locations/mock'
import { LeagueRegenerateConfirmDialog } from './LeagueRegenerateConfirmDialog'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  competitionName: string
  leagueId: string
  leagueName: string
  selectedLocation: string
  isConfirmOpen: boolean
  onSelectLocation: (value: string) => void
  onBackToList: () => void
  onBackToCompetition: () => void
  onBackToLeague: () => void
  onSave: () => void
  onConfirmClose: () => void
  onConfirmSave: () => void
}

export function LeagueRegenerateOverlay({
  competitionName,
  leagueId,
  leagueName,
  selectedLocation,
  isConfirmOpen,
  onSelectLocation,
  onBackToList,
  onBackToCompetition,
  onBackToLeague,
  onSave,
  onConfirmClose,
  onConfirmSave,
}: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* パンくず */}
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToList}
        >
          試合
        </Typography>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToCompetition}
        >
          {competitionName}
        </Typography>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToLeague}
        >
          {leagueName}(ID:{leagueId})
        </Typography>
        <Typography sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          リーグの試合を再生成
        </Typography>
      </Breadcrumbs>

      {/* フォームカード */}
      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
            リーグ一覧
          </Typography>

          <FormControl size="small" sx={{ width: 220 }}>
            <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>
              場所（後から変更できます）
            </InputLabel>
            <Select
              value={selectedLocation}
              label="場所（後から変更できます）"
              notched
              displayEmpty
              onChange={(e) => onSelectLocation(e.target.value)}
              renderValue={(val) =>
                val ? (
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                    {MOCK_LOCATIONS.find((l) => l.id === val)?.name ?? val}
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: '13px', color: 'rgba(47, 60, 140, 0.7)' }}>未選択</Typography>
                )
              }
              sx={{
                fontSize: '13px',
                color: '#2F3C8C',
                backgroundColor: 'transparent',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5B6DC6' },
              }}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: '13px', color: 'rgba(47, 60, 140, 0.7)' }}>未選択</Typography>
              </MenuItem>
              {MOCK_LOCATIONS.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{loc.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={onSave}
            sx={{ ...SAVE_BUTTON_SX, fontSize: '14px', py: 1 }}
          >
            保存
          </Button>
        </CardContent>
      </Card>

      {/* 保存確認ダイアログ（backdrop で画面が暗くなる） */}
      <LeagueRegenerateConfirmDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={onConfirmSave}
      />
    </Box>
  )
}
