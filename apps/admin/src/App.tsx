import { useState } from 'react'
import { Box } from '@mui/material'
import { Sidebar, DRAWER_WIDTH } from '@/components/layout/Sidebar'
import CompetitionsPage from '@/pages/CompetitionsPage'

export default function App() {
  const [selected, setSelected] = useState('competitions')

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar selected={selected} onSelect={setSelected} />
      <Box component="main" sx={{ flexGrow: 1, ml: `${DRAWER_WIDTH}px`, p: 3 }}>
        {selected === 'competitions' && <CompetitionsPage />}
      </Box>
    </Box>
  )
}
