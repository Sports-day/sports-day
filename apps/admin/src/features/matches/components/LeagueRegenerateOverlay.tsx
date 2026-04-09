import {
  Box,
  Breadcrumbs,
  ButtonBase,
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
import { useLocations } from '@/features/locations/hooks/useLocations'
import { LeagueRegenerateConfirmDialog } from './LeagueRegenerateConfirmDialog'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

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
  const { data: locations } = useLocations()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* パンくず */}
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <ButtonBase onClick={onBackToCompetition} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <ButtonBase onClick={onBackToLeague} sx={BREADCRUMB_LINK_SX}>
          {leagueName}(ID:{leagueId})
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          リーグの試合を再生成
        </Typography>
      </Breadcrumbs>

      {/* フォームカード */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
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
                    {locations.find((l) => l.id === val)?.name ?? val}
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
              {locations.map((loc) => (
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
