import { Box, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import type { ProgressionRule, ProgressionTarget } from '../hooks/useLeagueDetail'
import { CARD_FIELD_SX } from '@/styles/commonSx'

type Props = {
  enabled: boolean
  maxRank: number
  rules: ProgressionRule[]
  availableTargets: ProgressionTarget[]
  onEnabledChange: (enabled: boolean) => void
  onMaxRankChange: (maxRank: number) => void
  onRuleChange: (rank: number, targetId: string) => void
}

export function ProgressionRulesEditor({
  enabled,
  maxRank,
  rules,
  availableTargets,
  onEnabledChange,
  onMaxRankChange,
  onRuleChange,
}: Props) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#3949AB' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3949AB' },
            }}
          />
        }
        label={
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 600 }}>
            自動進出を有効にする
          </Typography>
        }
      />

      {enabled && (
        <Box sx={{ mt: 1.5, pl: 0.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            label="進出する順位数"
            type="number"
            value={maxRank}
            onChange={(e) => onMaxRankChange(Math.max(1, Math.min(10, Number(e.target.value))))}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 10 } }}
            sx={CARD_FIELD_SX}
          />

          {availableTargets.length === 0 ? (
            <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.6 }}>
              進出先として選択できるリーグ・トーナメントがありません
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.7 }}>
                順位ごとの進出先
              </Typography>
              {Array.from({ length: maxRank }, (_, i) => i + 1).map(rank => {
                const rule = rules.find(r => r.rank === rank)
                return (
                  <Box key={rank} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '13px', color: '#2F3C8C', minWidth: 28, fontWeight: 600 }}>
                      {rank}位
                    </Typography>
                    <TextField
                      select
                      value={rule?.targetId ?? ''}
                      onChange={(e) => onRuleChange(rank, e.target.value)}
                      size="small"
                      fullWidth
                      sx={CARD_FIELD_SX}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <Typography component="span" sx={{ color: '#2F3C8C', opacity: 0.5, fontSize: '13px' }}>
                          進出先を選択
                        </Typography>
                      </MenuItem>
                      {availableTargets.map(target => (
                        <MenuItem key={target.id} value={target.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '10px',
                                px: 0.5,
                                py: 0.1,
                                borderRadius: 0.5,
                                backgroundColor: target.type === 'league' ? '#E3F2FD' : '#F3E5F5',
                                color: target.type === 'league' ? '#1565C0' : '#6A1B9A',
                                fontWeight: 600,
                              }}
                            >
                              {target.type === 'league' ? 'リーグ' : 'トーナメント'}
                            </Typography>
                            <Typography component="span" sx={{ fontSize: '13px' }}>
                              {target.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
