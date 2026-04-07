import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
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
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { showToast } from '@/lib/toast'
import { AddMemberDialog } from './AddMemberDialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SceneSelect } from '@/components/ui/SceneSelect'
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
    groupId,
    setGroupId,
    groups,
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
    dirty,
    teamName,
  } = useTeamDetail(teamId)

  useUnsavedWarning(dirty)

  const onSave = async () => {
    await handleSave()
    showToast('チームを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    handleCloseDeleteDialog()
    handleDeleteTeam()
    showToast('チームを削除しました')
    onBack()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          チーム
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {teamName}
        </Typography>
      </Breadcrumbs>

      {/* 編集カード */}
      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            チームを編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="チーム名"
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={CARD_FIELD_SX}
            />

            <SceneSelect
              value={groupId || null}
              onChange={(id) => setGroupId(id ?? '')}
              scenes={groups}
              label="クラス"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={handleOpenDeleteDialog}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0 }}
              >
                このチームを削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                disabled={!dirty}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* メンバーカード */}
      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {teamName}のメンバー
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {['学籍番号', '名前', '性別', ''].map((header, i) => (
                  <TableCell key={i} sx={{ ...CARD_TABLE_HEAD_SX, ...(i === 3 ? { width: 48 } : {}) }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, i) => (
                <TableRow key={member.id}>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{member.id}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{member.name}</TableCell>
                  <TableCell sx={{ ...CARD_TABLE_CELL_SX, color: member.gender === '女' ? '#D71212' : undefined }}>{member.gender}</TableCell>
                  <TableCell sx={{ ...CARD_TABLE_CELL_SX, width: 48, p: 0, textAlign: 'center' }}>
                    <DeleteIcon
                      onClick={() => handleDeleteMember(i)}
                      sx={{ fontSize: 20, color: '#D71212', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={SAVE_BUTTON_SX}
            >
              メンバーを追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* メンバー追加ダイアログ */}
      <AddMemberDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddMembers}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="チームを削除しますか？"
        description="この操作は元に戻せません。チームを削除してもよろしいですか？"
        onClose={handleCloseDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
