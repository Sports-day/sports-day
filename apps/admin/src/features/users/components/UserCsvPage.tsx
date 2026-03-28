import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useUserCsv } from '../hooks/useUserCsv'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

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
  const { csvText, handleCsvChange, rows, handleCreate } = useUserCsv()

  const onCreateClick = () => {
    handleCreate()
    onBack()
  }

  return (
    <Box>
      {/* パンくずリスト */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Typography
          component="span"
          onClick={onBack}
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
        >
          ユーザー
        </Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>/</Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          CSV
        </Typography>
      </Box>

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
          追加するユーザー一覧のCSVファイルと所属クラスを選択してください。<br />
          所属クラスを指定してください。<br />
          CSVを入力してください。
        </Typography>

        {/* CSV入力 */}
        <TextField
          fullWidth
          size="small"
          value={csvText}
          onChange={(e) => handleCsvChange(e.target.value)}
          placeholder="CSVデータ"
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

        {/* テーブル */}
        <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEAD_SX}>ユーザー名</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>メールアドレス</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>性別</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>クラス</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ textAlign: 'center', color: '#9E9E9E', py: 4, fontSize: '13px', backgroundColor: '#FFFFFF' }}
                >
                  No Rows To Show
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => {
                const hasError = row.status !== '登録可能'
                return (
                  <TableRow key={i} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                    <TableCell sx={TABLE_CELL_SX}>{row.userName}</TableCell>
                    <TableCell sx={hasError ? ERROR_CELL_SX : TABLE_CELL_SX}>{row.email}</TableCell>
                    <TableCell sx={hasError ? ERROR_CELL_SX : TABLE_CELL_SX}>{row.gender}</TableCell>
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
