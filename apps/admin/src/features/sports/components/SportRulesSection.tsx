import { Box, IconButton, TextField, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import GavelIcon from '@mui/icons-material/Gavel'
import Markdown from 'react-markdown'
import { useSportRules } from '../hooks/useSportRules'
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_MAIN,
  COLOR_BORDER,
  COLOR_ERROR,
  COLOR_BG_DEFAULT,
} from '@/styles/colors'

type Props = {
  sportId: string
  rule: { id: string; rule: string } | null
}

export function SportRulesSection({ sportId, rule }: Props) {
  const {
    isEditing,
    editText,
    setEditText,
    handleStartEdit,
    handleCancel,
    handleSave,
    handleDelete,
  } = useSportRules(sportId)

  return (
    <Box
      component="fieldset"
      sx={{
        border: `1px solid ${COLOR_BORDER}`,
        borderRadius: 1.5,
        overflow: 'hidden',
        m: 0,
        p: 0,
      }}
    >
      <Box
        component="legend"
        sx={{
          ml: 1,
          px: 0.5,
          fontSize: '12px',
          color: COLOR_PRIMARY_DARK,
          lineHeight: 1.2,
        }}
      >
        ルール
      </Box>

      {isEditing ? (
        /* ── 編集モード ── */
        <Box sx={{ p: 1.5 }}>
          <TextField
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Markdown でルールを記述してください..."
            multiline
            minRows={4}
            maxRows={14}
            fullWidth
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '13px',
                fontFamily: 'monospace',
                backgroundColor: '#fff',
                borderRadius: 1.5,
                '& fieldset': { borderColor: COLOR_BORDER },
                '&:hover fieldset': { borderColor: COLOR_PRIMARY_MAIN },
                '&.Mui-focused fieldset': { borderColor: COLOR_PRIMARY_MAIN },
              },
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCancel()
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75, mt: 1.5 }}>
            <IconButton
              size="small"
              onClick={handleCancel}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                color: COLOR_PRIMARY_DARK,
                '&:hover': { backgroundColor: 'rgba(47, 60, 140, 0.08)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography component="span" sx={{ fontSize: '12px' }}>キャンセル</Typography>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleSave(rule?.id ?? null)}
              disabled={!editText.trim()}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                color: '#fff',
                backgroundColor: COLOR_PRIMARY_MAIN,
                '&:hover': { backgroundColor: COLOR_PRIMARY_DARK },
                '&.Mui-disabled': { backgroundColor: 'rgba(95, 109, 194, 0.3)', color: '#fff' },
              }}
            >
              <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography component="span" sx={{ fontSize: '12px' }}>保存</Typography>
            </IconButton>
          </Box>
        </Box>
      ) : rule ? (
        /* ── プレビューモード ── */
        <Box sx={{ p: 1.5 }}>
          <Box
            sx={{
              position: 'relative',
              px: 1.5,
              py: 0.75,
              backgroundColor: '#fff',
              borderRadius: 1.5,
              boxShadow: '0 1px 3px rgba(47, 60, 140, 0.06)',
            }}
          >
            {/* アクションボタン */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.25 }}>
              <IconButton
                size="small"
                onClick={() => handleStartEdit(rule.rule)}
                sx={{
                  p: 0.5,
                  color: COLOR_BORDER,
                  opacity: 0.6,
                  '&:hover': { color: COLOR_PRIMARY_MAIN, opacity: 1, backgroundColor: 'rgba(57, 73, 171, 0.08)' },
                }}
              >
                <EditIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(rule.id)}
                sx={{
                  p: 0.5,
                  color: COLOR_BORDER,
                  opacity: 0.6,
                  '&:hover': { color: COLOR_ERROR, opacity: 1, backgroundColor: 'rgba(215, 18, 18, 0.06)' },
                }}
              >
                <DeleteIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>

            {/* Markdownプレビュー */}
            <Box
              sx={{
                pr: 6,
                '& h1': { fontSize: '16px', fontWeight: 700, color: COLOR_PRIMARY_DARK, mt: 0, mb: 1 },
                '& h2': { fontSize: '14px', fontWeight: 700, color: COLOR_PRIMARY_DARK, mt: 1.5, mb: 0.75 },
                '& h3': { fontSize: '13px', fontWeight: 700, color: COLOR_PRIMARY_DARK, mt: 1.5, mb: 0.5 },
                '& p': { fontSize: '13px', color: COLOR_PRIMARY_DARK, lineHeight: 1.8, my: 0.5 },
                '& ul, & ol': { fontSize: '13px', color: COLOR_PRIMARY_DARK, pl: 2.5, my: 0.5 },
                '& li': { lineHeight: 1.8, mb: 0.25, '&::marker': { color: COLOR_PRIMARY_MAIN } },
                '& strong': { fontWeight: 700, color: COLOR_PRIMARY_DARK },
                '& em': { fontStyle: 'italic' },
                '& code': {
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  backgroundColor: `${COLOR_BG_DEFAULT}`,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  color: COLOR_PRIMARY_DARK,
                },
                '& hr': { border: 'none', borderTop: `1px solid ${COLOR_BORDER}`, opacity: 0.3, my: 1.5 },
                '& blockquote': {
                  borderLeft: `3px solid ${COLOR_PRIMARY_MAIN}`,
                  pl: 1.5,
                  ml: 0,
                  my: 1,
                  opacity: 0.85,
                },
                '& table': {
                  fontSize: '12px',
                  borderCollapse: 'collapse',
                  my: 1,
                  '& th, & td': {
                    border: `1px solid ${COLOR_BORDER}`,
                    px: 1,
                    py: 0.5,
                    color: COLOR_PRIMARY_DARK,
                  },
                  '& th': { fontWeight: 600, backgroundColor: `${COLOR_BG_DEFAULT}80` },
                },
              }}
            >
              <Markdown>{rule.rule}</Markdown>
            </Box>
          </Box>
        </Box>
      ) : (
        /* ── 空状態 ── */
        <Box sx={{ p: 1.5 }}>
          <Box
            onClick={() => handleStartEdit('')}
            sx={{
              textAlign: 'center',
              py: 1.5,
              cursor: 'pointer',
              borderRadius: 1.5,
              transition: 'background-color 0.15s',
              '&:hover': { backgroundColor: 'rgba(57, 73, 171, 0.04)' },
            }}
          >
            <GavelIcon sx={{ fontSize: 32, color: COLOR_PRIMARY_MAIN, opacity: 0.25, mb: 0.5 }} />
            <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_MAIN, opacity: 0.5 }}>
              ルールを追加してください
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
