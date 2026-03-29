import { Box, Breadcrumbs, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useAnnouncementDetail } from '../hooks/useAnnouncementDetail'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  announcementId: string
  onBack: () => void
}

export function InformationDetailPage({ announcementId, onBack }: Props) {
  const { announcementName, name, setName, content, setContent, handleSave, handleDelete } =
    useAnnouncementDetail(announcementId)

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
          お知らせ
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{announcementName}</Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {announcementName}を編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="名前*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={4}
              sx={CARD_FIELD_SX}
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={onDelete}
                sx={DELETE_BUTTON_SX}
              >
                このお知らせを削除
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
