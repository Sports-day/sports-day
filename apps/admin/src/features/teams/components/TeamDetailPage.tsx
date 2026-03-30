import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { useTeamDetail } from '../hooks/useTeamDetail'
import { AddMemberDialog } from './AddMemberDialog'
import { DeleteTeamDialog } from './DeleteTeamDialog'
import {
  CARD_TABLE_HEAD_SX,
  CARD_TABLE_CELL_SX,
  CARD_FIELD_SX,
  SAVE_BUTTON_SX,
  DELETE_BUTTON_SX,
  BREADCRUMB_LINK_SX,
  BREADCRUMB_CURRENT_SX,
  CARD_GRADIENT,
} from '@/styles/commonSx'

type Props = {
  teamId: string
  onBack: () => void
}

export function TeamDetailPage({ teamId, onBack }: Props) {
  const {
    name,
    setName,
    teamClass,
    setTeamClass,
    members,
    dialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleAddMembers,
    handleDeleteMember,
    handleSave,
    handleDeleteTeam,
    deleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    teamName,
  } = useTeamDetail(teamId)

  const onSave = () => {
    handleSave()
    onBack()
  }

  const onConfirmDelete = () => {
    handleDeleteTeam()
    onBack()
  }

  return (
    <Box>
      {/* パンくずリスト */}
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          チーム
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {teamName}
        </Typography>
      </Breadcrumbs>

      {/* カード */}
      <Box
        sx={{
          background: CARD_GRADIENT,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          {teamName}の情報
        </Typography>

        {/* チーム名 */}
        <TextField
          label="チーム名"
          fullWidth
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ ...CARD_FIELD_SX, mb: 2 }}
        />

        {/* 所属クラス */}
        <TextField
          label="所属クラス"
          fullWidth
          size="small"
          value={teamClass}
          onChange={(e) => setTeamClass(e.target.value)}
          sx={{ ...CARD_FIELD_SX, mb: 2 }}
        />

        {/* チームメンバー */}
        <Box
          component="fieldset"
          sx={{ border: '1px solid #5B6DC6', borderRadius: 1, padding: 0, margin: 0, marginBottom: 16 }}
        >
          <Box
            component="legend"
            sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.7, ml: 1, px: 0.5, lineHeight: 1.5 }}
          >
            チームメンバー
          </Box>
        <Table size="small" sx={{ borderRadius: 1, overflow: 'hidden', borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={CARD_TABLE_HEAD_SX}>学籍番号</TableCell>
              <TableCell sx={CARD_TABLE_HEAD_SX}>名前</TableCell>
              <TableCell sx={CARD_TABLE_HEAD_SX}>性別</TableCell>
              <TableCell sx={CARD_TABLE_HEAD_SX}>削除</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member, i) => (
              <TableRow key={member.studentId}>
                <TableCell sx={CARD_TABLE_CELL_SX}>{member.studentId}</TableCell>
                <TableCell sx={CARD_TABLE_CELL_SX}>{member.name}</TableCell>
                <TableCell sx={CARD_TABLE_CELL_SX}>{member.gender}</TableCell>
                <TableCell sx={CARD_TABLE_CELL_SX}>
                  <ButtonBase
                    onClick={() => handleDeleteMember(i)}
                    sx={{ fontSize: '13px', color: '#2F3C8C', '&:hover': { opacity: 0.7 } }}
                  >
                    削除
                  </ButtonBase>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Box>

        {/* チームメンバーを追加ボタン */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            ...SAVE_BUTTON_SX,
            fontSize: '14px',
            mb: 2,
          }}
        >
          チームメンバーを追加
        </Button>

        {/* 削除・保存ボタン */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
            onClick={handleOpenDeleteDialog}
            sx={DELETE_BUTTON_SX}
          >
            このチームを削除
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={onSave}
            sx={SAVE_BUTTON_SX}
          >
            保存
          </Button>
        </Box>
      </Box>

      {/* メンバー追加ダイアログ */}
      <AddMemberDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddMembers}
      />

      {/* チーム削除確認ダイアログ */}
      <DeleteTeamDialog
        open={deleteDialogOpen}
        teamName={teamName}
        onClose={handleCloseDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
