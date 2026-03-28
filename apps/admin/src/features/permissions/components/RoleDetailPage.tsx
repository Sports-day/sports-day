import { Box, Breadcrumbs, Button, Card, CardContent, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useRoleDetail } from '../hooks/useRoleDetail'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  roleId: string
  onBack: () => void
}

export function RoleDetailPage({ roleId, onBack }: Props) {
  const { roleName, roleId: id, name, setName, description, setDescription, isDefault, setIsDefault, handleSave, handleDelete } =
    useRoleDetail(roleId)

  const onSave = () => {
    handleSave()
    onBack()
  }

  const onDelete = () => {
    handleDelete()
    onBack()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBack}>
          権限
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{roleName}</Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT, border: '1px solid #5B6DC6' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {roleName}を編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="ロールID"
              value={id}
              fullWidth
              size="small"
              disabled
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="名前*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="備考"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  size="small"
                  sx={{ color: '#5B6DC6', '&.Mui-checked': { color: '#5B6DC6' } }}
                />
              }
              label={<Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>初期ロール</Typography>}
              sx={{ ml: 0 }}
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={onDelete}
                sx={DELETE_BUTTON_SX}
              >
                この権限を削除
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
        </CardContent>
      </Card>
    </Box>
  )
}
