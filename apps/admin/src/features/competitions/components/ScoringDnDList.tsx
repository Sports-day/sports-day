import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

type Option = { value: string; label: string }

type Props = {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function ScoringDnDList({ options, selected, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

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
    if (dragIndex === null || dragIndex === index) return
    const newOrder = [...selected]
    const [dragged] = newOrder.splice(dragIndex, 1)
    newOrder.splice(index, 0, dragged)
    onChange(newOrder)
    setDragIndex(index)
  }

  const handleDragEnd = () => setDragIndex(null)

  const unselected = options.filter(o => !selected.includes(o.value))

  return (
    <Box>
      <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.7, mb: 0.5 }}>
        採点方式（ドラッグで順番を変更）
      </Typography>

      {selected.map((value, index) => {
        const opt = options.find(o => o.value === value)
        if (!opt) return null
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
              mb: 0.5,
              px: 1,
              py: 0.5,
              backgroundColor: dragIndex === index ? '#C8CAD9' : '#EFF0F8',
              borderRadius: 1,
              border: '1px solid #5B6DC6',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <DragIndicatorIcon sx={{ fontSize: 16, color: '#5B6DC6', opacity: 0.6, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '13px', color: '#2F3C8C', flex: 1 }}>
              {index + 1}. {opt.label}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleToggleRemove(value)}
              sx={{ p: 0.25, color: '#2F3C8C', opacity: 0.6, '&:hover': { opacity: 1 } }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )
      })}

      {unselected.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.5, mb: 0.5 }}>
            追加可能
          </Typography>
          {unselected.map(opt => (
            <Box
              key={opt.value}
              onClick={() => handleToggleAdd(opt.value)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5,
                px: 1,
                py: 0.5,
                backgroundColor: 'transparent',
                borderRadius: 1,
                border: '1px dashed #5B6DC6',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#EFF0F8' },
              }}
            >
              <AddIcon sx={{ fontSize: 14, color: '#5B6DC6' }} />
              <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                {opt.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
