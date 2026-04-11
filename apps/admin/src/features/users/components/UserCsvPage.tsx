import {
  Box,
  Breadcrumbs,
  ButtonBase,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'
import { BackButton } from '@/components/ui/BackButton'
import { useUserCsv } from '../hooks/useUserCsv'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

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

const ERROR_CELL_SX = {
  ...TABLE_CELL_SX,
  color: '#D71212',
}

type Props = {
  onBack: () => void
}

export function UserCsvPage({ onBack }: Props) {
  const { csvText, handleCsvChange, rows, resolveUsers, handleCreate, loading } = useUserCsv()

  const hasUnresolved = rows.some((r) => r.status === '確認中')
  const hasRegistrable = rows.some((r) => r.status === '登録可能')

  const onResolveClick = async () => {
    await resolveUsers()
  }

  const onCreateClick = async () => {
    await handleCreate()
    showToast('ユーザーを一括作成しました')
    onBack()
  }

  return (
    <Box>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          ユーザー
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          CSV
        </Typography>
      </Breadcrumbs>

      {/* カード */}
      <Box
        sx={{
          background: CARD_GRADIENT,
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 1 }}>
          CSVデータ
        </Typography>

        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', mb: 2, lineHeight: 1.8 }}>
          メールアドレスとクラス名のCSVを入力してください。<br />
          形式: メールアドレス,クラス名
        </Typography>

        {/* CSV入力 */}
        <TextField
          fullWidth
          multiline
          minRows={4}
          size="small"
          value={csvText}
          onChange={(e) => handleCsvChange(e.target.value)}
          placeholder={'user1@example.com,1組\nuser2@example.com,2組'}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'transparent',
              '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
              '&:hover fieldset': { borderColor: '#5B6DC6' },
              '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
            },
            '& .MuiInputBase-input': { color: '#2F3C8C', fontSize: '13px' },
            '& .MuiInputBase-input::placeholder': { color: '#8890C4', opacity: 1 },
          }}
        />

        {/* ユーザー確認ボタン */}
        {hasUnresolved && (
          <Button
            variant="outlined"
            fullWidth
            onClick={onResolveClick}
            disabled={loading}
            sx={{
              mb: 2,
              height: '40px',
              borderRadius: 2,
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'ユーザーを確認'}
          </Button>
        )}

        {/* テーブル */}
        <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEAD_SX}>メールアドレス</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>クラス</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ textAlign: 'center', color: '#9E9E9E', py: 4, fontSize: '13px', backgroundColor: '#FFFFFF' }}
                >
                  No Rows To Show
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => {
                const hasError = row.status !== '登録可能' && row.status !== '確認中'
                return (
                  <TableRow key={i} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                    <TableCell sx={hasError ? ERROR_CELL_SX : TABLE_CELL_SX}>{row.email}</TableCell>
                    <TableCell sx={hasError ? ERROR_CELL_SX : TABLE_CELL_SX}>{row.class}</TableCell>
                    <TableCell sx={hasError ? ERROR_CELL_SX : TABLE_CELL_SX}>{row.status}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Box>

      {/* 作成ボタン */}
      <Button
        variant="contained"
        fullWidth
        onClick={onCreateClick}
        disabled={!hasRegistrable || loading}
        sx={{
          ...SAVE_BUTTON_SX,
          height: '48px',
          borderRadius: 2,
        }}
      >
        作成
      </Button>
    </Box>
  )
}
