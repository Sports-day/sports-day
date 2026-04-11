import { Box, Tooltip } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

type Props = {
  disabled?: boolean
  disabledTooltip?: string
}

export function DragHandle({ disabled = false, disabledTooltip = 'フィルタを解除して並び替え' }: Props) {
  return (
    <Tooltip title={disabled ? disabledTooltip : ''} placement="right">
      <DragIndicatorIcon
        sx={{
          fontSize: 18,
          color: disabled ? '#D6D6D6' : '#5B6DC6',
          opacity: disabled ? 0.5 : 0.4,
          cursor: disabled ? 'default' : 'grab',
        }}
      />
    </Tooltip>
  )
}
