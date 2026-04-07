import { useState } from 'react'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_MAIN,
  COLOR_PRIMARY_BUTTON,
  COLOR_BORDER,
  COLOR_BG_DEFAULT,
  COLOR_ERROR,
} from '@/styles/colors'

type Option = { value: string; label: string }

type Props = {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
}

const RANK_COLOR = COLOR_PRIMARY_MAIN

export function ScoringDnDList({ options, selected, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleToggleAdd = (value: string) => {
    onChange([...selected, value])
  }

  const handleToggleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value))
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
    if (dragIndex === null || dragIndex === index) return
    const newOrder = [...selected]
    const [dragged] = newOrder.splice(dragIndex, 1)
    newOrder.splice(index, 0, dragged)
    onChange(newOrder)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const unselected = options.filter(o => !selected.includes(o.value))

  return (
    <Box>
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
          採点方式
        </Box>
        <Box sx={{ p: 1.5 }}>
          {selected.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 1.5 }}>
              <EmojiEventsIcon sx={{ fontSize: 24, color: COLOR_PRIMARY_MAIN, opacity: 0.25, mb: 0.5 }} />
              <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_MAIN, opacity: 0.5 }}>
                採点項目を追加してください
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {selected.map((value, index) => {
                const opt = options.find(o => o.value === value)
                if (!opt) return null
                const isDragging = dragIndex === index
                const isDragOver = dragOverIndex === index && dragIndex !== index
                return (
                  <Box
                    key={value}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'grab',
                      userSelect: 'none',
                      opacity: isDragging ? 0.8 : 1,
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: RANK_COLOR,
                        width: 20,
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        px: 1.5,
                        py: 0.75,
                        backgroundColor: isDragging ? COLOR_BG_DEFAULT : '#fff',
                        borderRadius: 1.5,
                        transition: 'all 0.15s',
                        boxShadow: isDragging
                          ? '0 4px 12px rgba(47, 60, 140, 0.15)'
                          : '0 1px 3px rgba(47, 60, 140, 0.06)',
                        borderLeft: isDragOver ? `3px solid ${COLOR_PRIMARY_BUTTON}` : '3px solid transparent',
                        '&:hover': {
                          boxShadow: '0 2px 6px rgba(47, 60, 140, 0.1)',
                        },
                      }}
                    >
                      <DragIndicatorIcon sx={{ fontSize: 16, color: COLOR_BORDER, opacity: 0.5, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: 500, flex: 1 }}>
                        {opt.label}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleRemove(value)}
                        sx={{
                          p: 0.25,
                          color: COLOR_BORDER,
                          transition: 'color 0.15s',
                          '&:hover': { color: COLOR_ERROR },
                        }}
                      >
                        <RemoveCircleIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>

        {unselected.length > 0 && (
          <Box
            sx={{
              borderTop: `1px dashed ${COLOR_BORDER}`,
              p: 1.5,
              backgroundColor: `${COLOR_BG_DEFAULT}80`,
            }}
          >
            <Typography sx={{ fontSize: '11px', color: COLOR_PRIMARY_MAIN, fontWeight: 600, mb: 1, letterSpacing: '0.5px' }}>
              追加できる項目
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 0.75,
              }}
            >
              {unselected.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={<AddCircleOutlineIcon sx={{ fontSize: '14px !important' }} />}
                  onClick={() => handleToggleAdd(opt.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: '100%',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: COLOR_PRIMARY_DARK,
                    borderColor: COLOR_BORDER,
                    borderStyle: 'dashed',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '& .MuiChip-icon': { color: COLOR_PRIMARY_MAIN },
                    '&:hover': {
                      backgroundColor: `${COLOR_BG_DEFAULT}`,
                      borderColor: COLOR_PRIMARY_BUTTON,
                      borderStyle: 'solid',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Typography sx={{ fontSize: '11px', color: COLOR_PRIMARY_MAIN, opacity: 0.5, mt: 0.75 }}>
        ドラッグで優先順位を変更できます
      </Typography>
    </Box>
  )
}
