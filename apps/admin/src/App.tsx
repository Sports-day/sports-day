import { Box, Button, Typography } from '@mui/material'

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1" sx={{ mb: 2 }}>テーマ確認</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined">通常ボタン</Button>
        <Button variant="contained">保存ボタン</Button>
        <Button variant="outlined" color="error">削除ボタン</Button>
      </Box>
    </Box>
  )
}

export default App
