import { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

type Props = {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: 'small' | 'medium'
  fullWidth?: boolean
  sx?: SxProps<Theme>
  error?: boolean
  helperText?: string
}

/**
 * 数値入力フィールド。
 * - 編集中は空欄を許容（0が自動挿入されない）
 * - フォーカスを外した時に空欄なら変更前の値に戻す
 */
export function NumberInput({ label, value, onChange, min, max, step = 1, size = 'small', fullWidth, sx, error, helperText }: Props) {
  const [display, setDisplay] = useState(String(value))

  useEffect(() => {
    setDisplay(String(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setDisplay(raw)
    const num = Number(raw)
    if (raw !== '' && !isNaN(num)) {
      onChange(num)
    }
  }

  const handleBlur = () => {
    if (display === '' || isNaN(Number(display))) {
      setDisplay(String(value))
    }
  }

  return (
    <TextField
      label={label}
      type="number"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      size={size}
      fullWidth={fullWidth}
      error={error}
      helperText={helperText}
      sx={sx}
      slotProps={{ htmlInput: { min, max, step } }}
    />
  )
}
