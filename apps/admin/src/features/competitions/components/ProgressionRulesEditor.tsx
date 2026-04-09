import { Box, Chip, Divider, FormControl, InputLabel, ListSubheader, MenuItem, Select, Slider, Switch, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import type { ProgressionRule, ProgressionTarget } from '../types'
import { CARD_FIELD_SX } from '@/styles/commonSx'
import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_BUTTON,
  COLOR_BG_DEFAULT,
} from '@/styles/colors'

type GroupedTargets = {
  leagues: ProgressionTarget[]
  tournaments: ProgressionTarget[]
}

type Props = {
  enabled: boolean
  rankRange: [number, number]
  rules: ProgressionRule[]
  availableTargets: GroupedTargets
  entryCount: number
  onEnabledChange: (enabled: boolean) => void
  onRankRangeChange: (range: [number, number]) => void
  onRuleChange: (rank: number, targetId: string) => void
}

export function ProgressionRulesEditor({
  enabled,
  rankRange,
  rules,
  availableTargets,
  entryCount,
  onEnabledChange,
  onRankRangeChange,
  onRuleChange,
}: Props) {
  const [minRank, maxRank] = rankRange
  const maxAllowed = Math.max(1, entryCount)
  const rankCount = maxRank - minRank + 1
  const allTargets = [...availableTargets.leagues, ...availableTargets.tournaments]
  const hasTargets = allTargets.length > 0

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <EmojiEventsIcon sx={{ fontSize: 18, color: COLOR_PRIMARY_DARK }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: COLOR_PRIMARY_DARK }}>
          自動進出
        </Typography>
        <Switch
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          disabled={!hasTargets}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#3949AB' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3949AB' },
          }}
        />
      </Box>

      {!hasTargets && (
        <Typography sx={{ fontSize: '12px', color: COLOR_PRIMARY_DARK, opacity: 0.6, mt: 1, pl: 0.5 }}>
          同じ競技に属する進出先の大会がありません。
        </Typography>
      )}

      {enabled && hasTargets && (
        <Box sx={{ mt: 2, pl: 0.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entryCount < 2 ? (
            <Typography sx={{ fontSize: '12px', color: COLOR_PRIMARY_DARK, opacity: 0.6 }}>
              進出ルールを設定するには、2チーム以上のエントリーが必要です。
            </Typography>
          ) : (
            <>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: 600 }}>
                    進出する順位範囲
                  </Typography>
                  <Chip
                    label={minRank === maxRank ? `${minRank}位のみ` : `${minRank}位 〜 ${maxRank}位（${rankCount}チーム）`}
                    size="small"
                    sx={{ bgcolor: '#E8EAF6', color: '#3949AB', fontWeight: 700, fontSize: '12px' }}
                  />
                </Box>
                <Slider
                  value={rankRange}
                  onChange={(_, v) => onRankRangeChange(v as [number, number])}
                  min={1}
                  max={maxAllowed}
                  step={1}
                  marks={Array.from({ length: maxAllowed }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))}
                  valueLabelDisplay="off"
                  disableSwap
                  sx={{
                    color: '#3949AB',
                    '& .MuiSlider-mark': { backgroundColor: '#5B6DC6' },
                    '& .MuiSlider-markLabel': { fontSize: '11px', color: COLOR_PRIMARY_DARK, opacity: 0.6 },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: 600 }}>
                    順位ごとの進出先
                  </Typography>
                  {Array.from({ length: rankCount }, (_, i) => minRank + i).map(rank => {
                    const rule = rules.find(r => r.rank === rank)
                    const selectedTarget = allTargets.find(t => t.id === rule?.targetId)
                    const usedTargetIds = new Set(
                      rules
                        .filter(r => r.rank !== rank && r.targetId)
                        .map(r => r.targetId),
                    )
                    const hasBoth = availableTargets.leagues.length > 0 && availableTargets.tournaments.length > 0
                    return (
                      <Box
                        key={rank}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 1.5,
                        }}
                      >
                        <Chip
                          label={`${rank}位`}
                          size="small"
                          sx={{
                            minWidth: 44,
                            bgcolor: rank <= 3 ? '#E8EAF6' : COLOR_BG_DEFAULT,
                            color: '#3949AB',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        />
                        <ArrowForwardIcon sx={{ fontSize: 16, color: COLOR_PRIMARY_DARK, opacity: 0.4 }} />
                        <FormControl fullWidth size="small" sx={CARD_FIELD_SX}>
                          <InputLabel shrink>進出先</InputLabel>
                          <Select
                            value={rule?.targetId ?? ''}
                            label="進出先"
                            displayEmpty
                            onChange={(e) => onRuleChange(rank, e.target.value)}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  backgroundColor: COLOR_BG_DEFAULT,
                                  borderRadius: 1.5,
                                  boxShadow: '0 4px 16px rgba(47, 60, 140, 0.15)',
                                  mt: 0.5,
                                  '@media (min-width: 900px)': { minWidth: hasBoth ? 420 : 280 },
                                },
                              },
                              MenuListProps: {
                                sx: {
                                  '@media (min-width: 900px)': hasBoth ? {
                                    columns: 2,
                                    columnGap: '16px',
                                    columnRule: '1px solid #D0D4E4',
                                  } : {},
                                },
                              },
                            }}
                            renderValue={(v) => {
                              if (!v) return <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK, opacity: 0.5 }}>未設定</Typography>
                              return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {selectedTarget && (
                                    <Chip
                                      label={selectedTarget.type === 'league' ? 'リーグ' : 'トーナメント'}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        backgroundColor: selectedTarget.type === 'league' ? '#E3F2FD' : '#F3E5F5',
                                        color: selectedTarget.type === 'league' ? '#1565C0' : '#6A1B9A',
                                      }}
                                    />
                                  )}
                                  <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK }}>{selectedTarget?.name}</Typography>
                                </Box>
                              )
                            }}
                          >
                            {availableTargets.tournaments.length > 0 && [
                              <ListSubheader key="tournament-header" sx={{ fontSize: '11px', color: '#6A1B9A', fontWeight: 700, bgcolor: COLOR_BG_DEFAULT, lineHeight: '28px', borderBottom: '1px solid #E0E0E0', mb: 0.5 }}>
                                トーナメント
                              </ListSubheader>,
                              ...availableTargets.tournaments.map(target => {
                                const isSelected = target.id === rule?.targetId
                                return (
                                  <MenuItem
                                    key={target.id}
                                    value={target.id}
                                    disabled={usedTargetIds.has(target.id)}
                                    onClick={(e) => {
                                      if (isSelected) {
                                        e.preventDefault()
                                        onRuleChange(rank, '')
                                      }
                                    }}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      py: 1,
                                      breakInside: 'avoid',
                                      backgroundColor: isSelected ? '#E8EAF6' : 'transparent',
                                      '&:hover': { backgroundColor: isSelected ? '#DCE0F5' : '#E5E6F0' },
                                    }}
                                  >
                                    <Chip
                                      label="トーナメント"
                                      size="small"
                                      sx={{ height: 20, fontSize: '10px', fontWeight: 600, backgroundColor: '#F3E5F5', color: '#6A1B9A' }}
                                    />
                                    <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                                      {target.name}
                                    </Typography>
                                    {isSelected && <CheckIcon sx={{ fontSize: 16, color: COLOR_PRIMARY_BUTTON }} />}
                                  </MenuItem>
                                )
                              }),
                            ]}
                            {availableTargets.leagues.length > 0 && availableTargets.tournaments.length > 0 && (
                              <Divider key="divider" sx={{ my: 0.5, '@media (min-width: 900px)': { display: 'none' } }} />
                            )}
                            {availableTargets.leagues.length > 0 && [
                              <ListSubheader key="league-header" sx={{ fontSize: '11px', color: '#1565C0', fontWeight: 700, bgcolor: COLOR_BG_DEFAULT, lineHeight: '28px', borderBottom: '1px solid #E0E0E0', mb: 0.5, ...(hasBoth ? { '@media (min-width: 900px)': { breakBefore: 'column' } } : {}) }}>
                                リーグ
                              </ListSubheader>,
                              ...availableTargets.leagues.map(target => {
                                const isSelected = target.id === rule?.targetId
                                return (
                                  <MenuItem
                                    key={target.id}
                                    value={target.id}
                                    disabled={usedTargetIds.has(target.id)}
                                    onClick={(e) => {
                                      if (isSelected) {
                                        e.preventDefault()
                                        onRuleChange(rank, '')
                                      }
                                    }}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      py: 1,
                                      breakInside: 'avoid',
                                      backgroundColor: isSelected ? '#E8EAF6' : 'transparent',
                                      '&:hover': { backgroundColor: isSelected ? '#DCE0F5' : '#E5E6F0' },
                                    }}
                                  >
                                    <Chip
                                      label="リーグ"
                                      size="small"
                                      sx={{ height: 20, fontSize: '10px', fontWeight: 600, backgroundColor: '#E3F2FD', color: '#1565C0' }}
                                    />
                                    <Typography sx={{ fontSize: '13px', color: COLOR_PRIMARY_DARK, fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                                      {target.name}
                                    </Typography>
                                    {isSelected && <CheckIcon sx={{ fontSize: 16, color: COLOR_PRIMARY_BUTTON }} />}
                                  </MenuItem>
                                )
                              }),
                            ]}
                          </Select>
                        </FormControl>
                      </Box>
                    )
                  })}
                </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
