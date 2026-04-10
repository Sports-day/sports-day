import { ButtonBase, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type Props = {
  onClick: () => void
}

export function BackButton({ onClick }: Props) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color: '#2F3C8C',
        '&:hover': { opacity: 0.7 },
        alignSelf: 'flex-start',
      }}
    >
      <ArrowBackIcon sx={{ fontSize: 18 }} />
      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>戻る</Typography>
    </ButtonBase>
  )
}
