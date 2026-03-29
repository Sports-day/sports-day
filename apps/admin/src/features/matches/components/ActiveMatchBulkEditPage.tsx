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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import { MOCK_LOCATIONS } from '@/features/locations/mock'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'
import type { BulkEditRow } from '../hooks/useBulkEdit'

const FIELD_SX = {
  width: { xs: '100%', sm: '33%' },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#2F3C8C' },
    '&.Mui-focused fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
  },
  '& input, & textarea': { fontSize: '13px', color: '#2F3C8C' },
  '& .MuiInputLabel-root': { color: '#2F3C8C', fontSize: '13px' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C' },
}

const HEADER_CELL_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #A0AADE',
  py: 1,
  px: 1.5,
}

const SECTION_LABEL_SX = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#2F3C8C',
  mb: 0.5,
}

type Props = {
  competitionName: string
  leagueId: string
  leagueName: string
  filterDate: string
  filterLocation: string
  csvData: string
  parsedRows: BulkEditRow[]
  onFilterDateChange: (v: string) => void
  onFilterLocationChange: (v: string) => void
  onCsvDataChange: (v: string) => void
  onBack: () => void
  onBackToList: () => void
  onBackToCompetition: () => void
  onExecute: () => void
}

export function ActiveMatchBulkEditPage({
  competitionName,
  leagueId,
  leagueName,
  filterDate,
  filterLocation,
  csvData,
  parsedRows,
  onFilterDateChange,
  onFilterLocationChange,
  onCsvDataChange,
  onBack,
  onBackToList,
  onBackToCompetition,
  onExecute,
}: Props) {
  const locationName = filterLocation
    ? (MOCK_LOCATIONS.find((l) => l.id === filterLocation)?.name ?? filterLocation)
    : '-'
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
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          {leagueName}(ID:{leagueId})
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          試合一括編集
        </Typography>
      </Breadcrumbs>

      {/* 1枚のカード（フォーム＋テーブル） */}
      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* タイトル */}
          <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#2F3C8C' }}>
            試合一括編集
          </Typography>

          {/* 1試合目開始時刻 */}
          <TextField
            label="1試合目開始時刻"
            type="datetime-local"
            size="small"
            value={filterDate}
            onChange={(e) => onFilterDateChange(e.target.value)}
            sx={FIELD_SX}
            InputLabelProps={{ shrink: true }}
          />

          {/* 開催場所 */}
          <FormControl size="small" sx={{ width: { xs: '100%', sm: '33%' } }}>
            <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>開催場所</InputLabel>
            <Select
              value={filterLocation}
              label="開催場所"
              notched
              displayEmpty
              onChange={(e) => onFilterLocationChange(e.target.value)}
              sx={{
                fontSize: '13px',
                backgroundColor: 'transparent',
                '& fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
                '&:hover fieldset': { borderColor: '#2F3C8C' },
                '&.Mui-focused fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
              }}
              renderValue={(val) =>
                val ? (
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                    {MOCK_LOCATIONS.find((l) => l.id === val)?.name ?? val}
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: '13px', color: 'rgba(47, 60, 140, 0.7)' }}>未選択</Typography>
                )
              }
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

          {/* CSVデータ */}
          <Box>
            <Typography sx={SECTION_LABEL_SX}>CSVデータ</Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={3}
              placeholder="CSVデータ"
              value={csvData}
              onChange={(e) => onCsvDataChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
                  '&:hover fieldset': { borderColor: '#2F3C8C' },
                  '&.Mui-focused fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
                },
                '& textarea': { fontSize: '13px', color: '#2F3C8C' },
                '& .MuiInputBase-input::placeholder': {
                  color: '#2F3C8C',
                  opacity: 0.7,
                },
              }}
            />
          </Box>

          {/* テーブル（白背景） */}
          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', border: '1px solid #C0C6E9' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['ID', '左チーム', '右チーム', '場所', 'スコア'].map((col) => (
                    <TableCell key={col} sx={HEADER_CELL_SX}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ textAlign: 'center', py: 6, fontSize: '13px', color: '#9e9e9e', backgroundColor: '#FFFFFF' }}
                    >
                      CSVを入力してください（例: matchId,scoreA,scoreB）
                    </TableCell>
                  </TableRow>
                ) : (
                  parsedRows.map((row) => (
                    <TableRow key={row.matchId}>
                      <TableCell sx={{ fontSize: '13px', color: '#2F3C8C', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0', py: 1, px: 1.5 }}>{row.matchId}</TableCell>
                      <TableCell sx={{ fontSize: '13px', color: '#2F3C8C', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0', py: 1, px: 1.5 }}>{row.teamAName}</TableCell>
                      <TableCell sx={{ fontSize: '13px', color: '#2F3C8C', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0', py: 1, px: 1.5 }}>{row.teamBName}</TableCell>
                      <TableCell sx={{ fontSize: '13px', color: '#2F3C8C', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0', py: 1, px: 1.5 }}>{locationName}</TableCell>
                      <TableCell sx={{ fontSize: '13px', color: '#2F3C8C', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0', py: 1, px: 1.5 }}>{row.scoreA} - {row.scoreB}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>

          {/* ボタン */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{
                fontSize: '13px',
                color: '#D71212',
                borderColor: '#D71212',
                whiteSpace: 'nowrap',
                minWidth: '120px',
                '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
              }}
            >
              戻る
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={onExecute}
              fullWidth
              sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
            >
              実行
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
