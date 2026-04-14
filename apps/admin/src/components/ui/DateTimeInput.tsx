import { useEffect, useRef, useState } from 'react'
import { Box, ButtonBase, Collapse, IconButton, Popover, Typography } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_BUTTON, COLOR_BORDER } from '@/styles/colors'

type Props = {
  /** datetime-local 形式の値 (YYYY-MM-DDTHH:mm) */
  value: string
  onChange: (value: string) => void
  label?: string
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7)
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
const pad = (n: number) => String(n).padStart(2, '0')

export function DateTimeInput({ value, onChange, label }: Props) {
  const [datePart, timePart] = splitDatetime(value)
  const [currentHour, currentMinute] = parseTime(timePart)
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [calAnchor, setCalAnchor] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!expanded) return
    const handleClickOutside = (e: MouseEvent) => {
      // Popover が開いているときは外側クリック判定をスキップ
      // （Popover は document.body 直下のポータルにレンダリングされるため
      //   containerRef の外側と誤判定されてしまうのを防ぐ）
      if (calAnchor) return
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expanded, calAnchor])
  const [viewYear, setViewYear] = useState(0)
  const [viewMonth, setViewMonth] = useState(0)
  const chipRef = useRef<HTMLButtonElement>(null)

  const openCalendar = () => {
    const [y, m] = datePart.split('-').map(Number)
    setViewYear(y)
    setViewMonth(m)
    setCalAnchor(chipRef.current)
  }

  const emit = (h: number, m: number, d?: string) => {
    onChange(`${d ?? datePart}T${pad(h)}:${pad(m)}`)
  }

  const selectDate = (d: string) => {
    emit(currentHour, currentMinute, d)
    setCalAnchor(null)
  }

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(viewYear - 1); setViewMonth(12) }
    else setViewMonth(viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(viewYear + 1); setViewMonth(1) }
    else setViewMonth(viewMonth + 1)
  }

  const calendarDays = buildCalendarDays(viewYear, viewMonth)
  const selectedDate = datePart
  const todayStr = toDateStr(new Date())

  const [dy, dm, dd] = datePart.split('-').map(Number)
  const dayOfWeek = WEEKDAYS[new Date(dy, dm - 1, dd).getDay()]
  const displayDate = `${dm}/${dd} (${dayOfWeek})`

  return (
    <Box
      ref={containerRef}
      component="fieldset"
      onClick={() => !expanded && setExpanded(true)}
      sx={{
        border: `1px solid ${COLOR_BORDER}`,
        borderRadius: 1,
        m: 0,
        p: 0,
        paddingBlockStart: 0,
        transition: 'background-color 0.15s',
        cursor: expanded ? 'default' : 'pointer',
        '&:hover': expanded ? {} : { backgroundColor: 'rgba(91,109,198,0.04)' },
      }}
    >
      <Box
        component="legend"
        sx={{
          fontSize: '12px',
          color: COLOR_PRIMARY_DARK,
          px: 0.5,
          ml: 1,
          lineHeight: 1,
          mb: '-6px',
        }}
      >
        {label ?? '時刻設定'}
      </Box>

      {/* ─── 縮小時：クリックで展開 ─── */}
      {!expanded && (
        <ButtonBase
          onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            px: '14px',
            py: '8.5px',
            textAlign: 'left',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              color: COLOR_PRIMARY_DARK,
              fontVariantNumeric: 'tabular-nums',
              flex: 1,
            }}
          >
            {dy}/{pad(dm)}/{pad(dd)} {pad(currentHour)}:{pad(currentMinute)}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              position: 'absolute',
              right: 7,
              fontSize: 20,
              color: COLOR_BORDER,
              pointerEvents: 'none',
            }}
          />
        </ButtonBase>
      )}

      {/* ─── 展開時：ピッカー本体 ─── */}
      <Collapse in={expanded} timeout={200}>
        <Box sx={{ px: 1.5, pt: 1.5, pb: 1.5 }}>
          {/* 閉じるボタン + 日付チップ */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <ButtonBase
              ref={chipRef}
              onClick={openCalendar}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: 1.5,
                px: 1.5,
                py: 0.8,
                transition: 'background-color 0.15s',
                '&:hover': { backgroundColor: 'rgba(91,109,198,0.08)' },
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 12, color: COLOR_BORDER, display: 'flex' }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: COLOR_PRIMARY_DARK, letterSpacing: 0.3, lineHeight: 1 }}>
                {displayDate}
              </Typography>
            </ButtonBase>
            <IconButton
              onClick={() => setExpanded(false)}
              size="small"
              sx={{ color: COLOR_BORDER, '&:hover': { backgroundColor: 'rgba(91,109,198,0.08)' } }}
            >
              <KeyboardArrowDownIcon sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
            </IconButton>
          </Box>

          {/* 時刻表示 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
            <Typography
              sx={{ fontSize: '36px', fontWeight: 800, color: COLOR_PRIMARY_DARK, fontVariantNumeric: 'tabular-nums', letterSpacing: 2, lineHeight: 1 }}
            >
              {pad(currentHour)}
            </Typography>
            <Typography
              sx={{ fontSize: '30px', fontWeight: 800, color: COLOR_PRIMARY_DARK, opacity: 0.5, lineHeight: 1, mx: 0.3 }}
            >
              :
            </Typography>
            <Typography
              sx={{ fontSize: '36px', fontWeight: 800, color: COLOR_PRIMARY_DARK, fontVariantNumeric: 'tabular-nums', letterSpacing: 2, lineHeight: 1 }}
            >
              {pad(currentMinute)}
            </Typography>
          </Box>

          {/* カレンダーポップオーバー */}
          <Popover
            open={Boolean(calAnchor)}
            anchorEl={calAnchor}
            onClose={() => setCalAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.5,
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(57,73,171,0.2)',
                  border: 'none',
                },
              },
            }}
          >
            <Box sx={{ width: 280 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1,
                  py: 0.8,
                  backgroundColor: COLOR_BORDER,
                }}
              >
                <IconButton onClick={prevMonth} size="small" sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
                  <ChevronLeftIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
                  {viewYear}年 {viewMonth}月
                </Typography>
                <IconButton onClick={nextMonth} size="small" sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}>
                  <ChevronRightIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 1, pt: 1, pb: 0.3 }}>
                {WEEKDAYS.map((w, i) => (
                  <Typography
                    key={w}
                    sx={{
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: i === 0 ? '#E53935' : i === 6 ? '#1E88E5' : COLOR_PRIMARY_DARK,
                      opacity: 0.6,
                      letterSpacing: 0.5,
                    }}
                  >
                    {w}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.3, px: 1, pb: 1.2 }}>
                {calendarDays.map((day, i) => {
                  if (!day) return <Box key={`empty-${i}`} />
                  const dateStr = `${viewYear}-${pad(viewMonth)}-${pad(day)}`
                  const isSelected = dateStr === selectedDate
                  const isToday = dateStr === todayStr
                  const dayOfWeekIdx = new Date(viewYear, viewMonth - 1, day).getDay()
                  return (
                    <ButtonBase
                      key={day}
                      onClick={() => selectDate(dateStr)}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        mx: 'auto',
                        fontSize: '13px',
                        fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                        fontVariantNumeric: 'tabular-nums',
                        color: isSelected
                          ? '#fff'
                          : dayOfWeekIdx === 0 ? '#E53935'
                          : dayOfWeekIdx === 6 ? '#1E88E5'
                          : COLOR_PRIMARY_DARK,
                        background: isSelected
                          ? COLOR_BORDER
                          : isToday
                            ? 'rgba(57,73,171,0.08)'
                            : 'transparent',
                        boxShadow: isSelected ? '0 2px 8px rgba(91,109,198,0.3)' : 'none',
                        border: isToday && !isSelected ? `1.5px solid ${COLOR_PRIMARY_BUTTON}` : 'none',
                        transition: 'background-color 0.15s',
                        '&:hover': {
                          background: isSelected
                            ? COLOR_BORDER
                            : 'rgba(57,73,171,0.1)',
                        },
                      }}
                    >
                      {day}
                    </ButtonBase>
                  )
                })}
              </Box>
            </Box>
          </Popover>

          {/* 時セレクター */}
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: COLOR_PRIMARY_DARK, opacity: 0.5, mb: 0.5, ml: 0.5, letterSpacing: 1 }}>
              時
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.4,
                overflowX: 'auto',
                pb: 0.5,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 3 },
                '&::-webkit-scrollbar-thumb': { background: COLOR_BORDER, borderRadius: 2 },
              }}
            >
              {HOURS.map((h) => {
                const selected = h === currentHour
                return (
                  <ButtonBase
                    key={h}
                    onClick={() => emit(h, currentMinute)}
                    sx={{
                      minWidth: 44,
                      height: 32,
                      borderRadius: 1.5,
                      fontSize: '13px',
                      fontWeight: selected ? 700 : 500,
                      fontVariantNumeric: 'tabular-nums',
                      color: selected ? '#fff' : COLOR_PRIMARY_DARK,
                      background: selected
                        ? COLOR_BORDER
                        : 'rgba(255,255,255,0.5)',
                      boxShadow: selected ? '0 2px 8px rgba(91,109,198,0.3)' : 'none',
                      border: selected ? 'none' : '1px solid rgba(91,109,198,0.2)',
                      transition: 'background-color 0.15s, box-shadow 0.15s',
                      flexShrink: 0,
                      '&:hover': {
                        background: selected
                          ? COLOR_BORDER
                          : 'rgba(57,73,171,0.1)',
                      },
                    }}
                  >
                    {h}
                  </ButtonBase>
                )
              })}
            </Box>
          </Box>

          {/* 分セレクター */}
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: COLOR_PRIMARY_DARK, opacity: 0.5, mb: 0.5, ml: 0.5, letterSpacing: 1 }}>
              分
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.5 }}>
              {MINUTES.map((m) => {
                const selected = m === currentMinute
                return (
                  <ButtonBase
                    key={m}
                    onClick={() => emit(currentHour, m)}
                    sx={{
                      height: 34,
                      borderRadius: 1.5,
                      fontSize: '13px',
                      fontWeight: selected ? 700 : 500,
                      fontVariantNumeric: 'tabular-nums',
                      color: selected ? '#fff' : COLOR_PRIMARY_DARK,
                      background: selected
                        ? COLOR_BORDER
                        : 'rgba(255,255,255,0.5)',
                      boxShadow: selected ? '0 2px 8px rgba(91,109,198,0.3)' : 'none',
                      border: selected ? 'none' : '1px solid rgba(91,109,198,0.2)',
                      transition: 'background-color 0.15s, box-shadow 0.15s',
                      '&:hover': {
                        background: selected
                          ? COLOR_BORDER
                          : 'rgba(57,73,171,0.1)',
                      },
                    }}
                  >
                    {pad(m)}
                  </ButtonBase>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

/* ─── ユーティリティ ─── */

function splitDatetime(value: string): [string, string] {
  if (!value) {
    const now = new Date()
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    return [date, time]
  }
  const parts = value.split('T')
  return [parts[0] || '', parts[1] || '00:00']
}

function parseTime(time: string): [number, number] {
  const [h, m] = time.split(':').map(Number)
  const roundedM = Math.round((m ?? 0) / 5) * 5
  return [h ?? 0, roundedM >= 60 ? 55 : roundedM]
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}
