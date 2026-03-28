import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckIcon from '@mui/icons-material/Check'
import { useTeamBulkRename } from '../hooks/useTeamBulkRename'
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

type Props = {
  onBack: () => void
}

export function TeamBulkRenamePage({ onBack }: Props) {
  const { csvText, handleCsvChange, rows, handleExecute, handleReset } = useTeamBulkRename()

  const onExecute = () => {
    handleExecute()
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
          チーム
        </Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>/</Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          チーム名の一括変更
        </Typography>
      </Box>

      {/* 1つのカードにすべてまとめる */}
      <Box
        sx={{
          background: CARD_GRADIENT,
          borderRadius: 2,
          p: 2,
        }}
      >
        {/* CSVデータ入力エリア */}
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', mb: 1 }}>
          CSVデータ
        </Typography>
        <TextareaAutosize
          minRows={4}
          value={csvText}
          onChange={(e) => handleCsvChange(e.target.value)}
          placeholder="CSVデータ"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '13px',
            color: '#2F3C8C',
            backgroundColor: '#EEF0FA',
            border: '1px solid #C0C5E8',
            borderRadius: '6px',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            marginBottom: '16px',
          }}
        />

        {/* テーブル */}
        <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEAD_SX}>ID</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>変更前の名前</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>変更後の名前</TableCell>
              <TableCell sx={TABLE_HEAD_SX}>スタータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', color: '#9E9E9E', py: 4, fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                  No Rows To Show
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={i} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                  <TableCell sx={TABLE_CELL_SX}>{row.id}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.beforeName}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.afterName}</TableCell>
                  <TableCell sx={{
                    ...TABLE_CELL_SX,
                    color: row.status === '成功' ? '#2e7d32' : row.status === 'エラー' ? '#c62828' : '#2F3C8C',
                  }}>
                    {row.status}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ボタン */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => { handleReset(); onBack() }}
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#2F3C8C',
              border: '1px solid #5B6DC6',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#E8EAF6' },
              minWidth: '100px',
            }}
          >
            戻る
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={onExecute}
            disabled={rows.length === 0}
            sx={{
              ...SAVE_BUTTON_SX,
              '&:disabled': { backgroundColor: '#B0B8E8', color: '#FFFFFF' },
            }}
          >
            実行
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
