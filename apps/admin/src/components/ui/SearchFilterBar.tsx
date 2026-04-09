/**
 * 共通検索・絞り込みコンポーネント（アコーディオン型）
 *
 * 画面に応じて3つのモードで利用可能:
 *  - 検索のみ: keyword / onKeywordChange だけ渡す
 *  - フィルタのみ: filters / filterValues / onFilterChange だけ渡す
 *  - 検索 + フィルタ: 両方渡す
 */
import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { Box, Chip, Collapse, IconButton, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_MAIN, COLOR_PRIMARY_LIGHT } from '@/styles/colors'

/* ──────────────────────────────────────────────
   型定義
   ────────────────────────────────────────────── */

export type FilterOption = {
  value: string
  label: string
}

export type FilterDef = {
  key: string
  label: string
  options: FilterOption[]
}

export type SearchFilterBarProps = {
  /** 検索キーワード（省略するとフィルタのみモード） */
  keyword?: string
  onKeywordChange?: (v: string) => void
  /** 検索プレースホルダ */
  placeholder?: string
  /** フィルタ定義（省略すると検索のみモード） */
  filters?: FilterDef[]
  /** フィルタ値（key → value） */
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  /** 件数表示 */
  resultCount?: number
  /** 右端に配置するアクション要素 */
  actions?: ReactNode
  /** フィルタパネルのデフォルト開閉（default: false） */
  defaultOpen?: boolean
  /** 全フィルタ＋キーワードをリセットするコールバック */
  onReset?: () => void
}

/* ──────────────────────────────────────────────
   コンポーネント
   ────────────────────────────────────────────── */

const GAP = 20 // gap between groups in px

/**
 * ビンパッキング: 各グループの自然幅（全チップ1行時）を元に行を構成する。
 *
 * - 自然幅がコンテナ幅に収まるグループ → 固定幅として扱う
 * - 収まらないグループ → 可変幅（残りスペースで折り返す）として扱う
 *
 * 定義順に各グループを行に配置していき、現在の行に入りきらない場合、
 * 後続のまだ配置していない固定幅グループで入るものがあれば先に詰める。
 */
function packRows(naturalWidths: number[], containerWidth: number): number[][] {
  const n = naturalWidths.length
  // 「小さいグループ」= 自然幅がコンテナ幅の半分以下
  const isSmall = naturalWidths.map((w) => w <= containerWidth * 0.5)

  const rows: number[][] = []
  const placed = new Set<number>()

  for (let i = 0; i < n; i++) {
    if (placed.has(i)) continue

    if (isSmall[i]) {
      // 小さいグループ: 同じ行に他の小さいグループを詰めていく
      const row: number[] = [i]
      placed.add(i)
      let remaining = containerWidth - naturalWidths[i]

      for (let j = i + 1; j < n; j++) {
        if (placed.has(j)) continue
        if (!isSmall[j]) continue // 大きいグループはスキップ
        if (naturalWidths[j] + GAP <= remaining) {
          row.push(j)
          placed.add(j)
          remaining -= naturalWidths[j] + GAP
        }
      }
      rows.push(row)
    } else {
      // 大きいグループ: まず後続の小さい未配置グループを集めて同じ行に入れられるか試す
      // 小さいグループを先に並べ、残りスペースを大きいグループに渡す
      const smallOnes: number[] = []
      let smallTotal = 0
      for (let j = 0; j < n; j++) {
        if (placed.has(j) || j === i || !isSmall[j]) continue
        const need = smallTotal === 0 ? naturalWidths[j] : naturalWidths[j] + GAP
        if (smallTotal + need + GAP + 100 <= containerWidth) {
          // 100px = 大きいグループの最低限の幅
          smallOnes.push(j)
          smallTotal += need
        }
      }

      const row: number[] = [...smallOnes, i]
      for (const s of smallOnes) placed.add(s)
      placed.add(i)
      rows.push(row)
    }
  }
  return rows
}

function FilterPanel({
  filters,
  filterValues = {},
  onFilterChange,
  showBorder,
  actions,
  resultCount,
  hasActiveFilter,
  onReset,
}: {
  filters: FilterDef[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  showBorder: boolean
  actions?: ReactNode
  resultCount?: number
  hasActiveFilter: boolean
  onReset?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<number[][] | null>(null)

  const measure = useCallback(() => {
    const container = containerRef.current
    const measureEl = measureRef.current
    if (!container || !measureEl) return
    const containerWidth = container.clientWidth - 32 // px padding (px:2 = 16px * 2)
    const groups = measureEl.children
    const widths: number[] = []
    for (let i = 0; i < groups.length; i++) {
      widths.push((groups[i] as HTMLElement).offsetWidth)
    }
    if (widths.length === 0 || widths.some((w) => w === 0)) return
    setRows(packRows(widths, containerWidth))
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [measure, filters])

  const chipSx = (active: boolean) => ({
    fontSize: '11px',
    height: 24,
    fontWeight: active ? 600 : 400,
    backgroundColor: active ? COLOR_PRIMARY_MAIN : '#fff',
    color: active ? '#fff' : '#666',
    border: active ? 'none' : '1px solid #D0D3E8',
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': {
      backgroundColor: active ? COLOR_PRIMARY_LIGHT : '#F0F1FA',
    },
  })

  const renderGroup = (f: FilterDef) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 600,
          color: COLOR_PRIMARY_DARK,
          opacity: 0.5,
          letterSpacing: '0.05em',
        }}
      >
        {f.label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {f.options.map((opt) => {
          const active = filterValues[f.key] === opt.value
          return (
            <Chip
              key={opt.value}
              label={opt.label}
              size="small"
              onClick={() => onFilterChange?.(f.key, active ? '' : opt.value)}
              sx={chipSx(active)}
            />
          )
        })}
      </Box>
    </Box>
  )

  const footer = (hasActiveFilter || resultCount !== undefined || actions) ? (
    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1, alignSelf: 'center' }}>
      {hasActiveFilter && (
        <Typography
          component="span"
          onClick={onReset}
          sx={{
            fontSize: '11px',
            fontWeight: 500,
            color: COLOR_PRIMARY_MAIN,
            opacity: 0.7,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
            borderBottom: '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': {
              opacity: 1,
              borderBottomColor: COLOR_PRIMARY_MAIN,
            },
          }}
        >
          条件をリセット
        </Typography>
      )}
      {resultCount !== undefined && (
        <Typography sx={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>
          {resultCount}件
        </Typography>
      )}
      {actions}
    </Box>
  ) : null

  return (
    <Box
      ref={containerRef}
      sx={{
        borderTop: showBorder ? '1px solid #E0E3F5' : 'none',
        px: 2,
        py: 1.5,
        backgroundColor: '#FAFAFF',
      }}
    >
      {/* 測定用: 各グループを全チップ1行でレンダーして自然な幅を測定 */}
      <Box
        ref={measureRef}
        aria-hidden
        sx={{ position: 'absolute', visibility: 'hidden', height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        {filters.map((f) => (
          <Box key={f.key} sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em' }}>{f.label}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap' }}>
              {f.options.map((opt) => (
                <Chip key={opt.value} label={opt.label} size="small" sx={{ fontSize: '11px', height: 24 }} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* レイアウト */}
      {rows ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {rows.map((row, ri) => (
            <Box
              key={ri}
              sx={{ display: 'flex', alignItems: 'flex-start', gap: `${GAP}px`, flexWrap: 'wrap' }}
            >
              {row.map((idx) => (
                <Box key={filters[idx].key}>{renderGroup(filters[idx])}</Box>
              ))}
              {ri === rows.length - 1 && footer}
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: `${GAP}px`, flexWrap: 'wrap' }}>
          {filters.map((f) => <Box key={f.key}>{renderGroup(f)}</Box>)}
          {footer}
        </Box>
      )}
    </Box>
  )
}

export function SearchFilterBar({
  keyword,
  onKeywordChange,
  placeholder = '検索…',
  filters = [],
  filterValues = {},
  onFilterChange,
  resultCount,
  actions,
  defaultOpen = false,
  onReset,
}: SearchFilterBarProps) {
  const hasSearch = keyword !== undefined && onKeywordChange !== undefined
  const hasFilters = filters.length > 0
  const filtersOnly = hasFilters && !hasSearch
  const activeFilterCount = Object.values(filterValues).filter(Boolean).length
  const hasActiveFilter = activeFilterCount > 0 || !!keyword

  const [open, setOpen] = useState(defaultOpen || filtersOnly)

  // 何も渡されていなければ何も描画しない
  if (!hasSearch && !hasFilters) return null

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        border: '1px solid #E0E3F5',
        overflow: 'hidden',
        boxShadow: '0 1px 8px rgba(47, 60, 140, 0.05)',
      }}
    >
      {/* ─── メイン行 ─── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, height: 52, flexShrink: 0 }}>
        {hasSearch ? (
          <>
            <SearchIcon sx={{ fontSize: 20, color: COLOR_PRIMARY_MAIN, flexShrink: 0 }} />
            <Box
              component="input"
              value={keyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onKeywordChange!(e.target.value)}
              placeholder={placeholder}
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: COLOR_PRIMARY_DARK,
                backgroundColor: 'transparent',
                minWidth: 0,
                '&::placeholder': { color: COLOR_PRIMARY_DARK, opacity: 0.35 },
              }}
            />
            {keyword && (
              <IconButton size="small" onClick={() => onKeywordChange!('')} sx={{ color: '#999', flexShrink: 0 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </>
        ) : (
          <>
            <TuneIcon sx={{ fontSize: 20, color: COLOR_PRIMARY_MAIN, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '14px', color: COLOR_PRIMARY_DARK, fontWeight: 500, flex: 1 }}>
              絞り込み
            </Typography>
          </>
        )}

        {/* 件数バッジ */}
        {resultCount !== undefined && (
          <Typography sx={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap', mx: 0.5, flexShrink: 0 }}>
            {resultCount}件
          </Typography>
        )}

        {/* フィルタ展開トグル（検索 + フィルタ併用時のみ） */}
        {hasFilters && !filtersOnly && (
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              color: activeFilterCount > 0 ? COLOR_PRIMARY_MAIN : '#999',
              backgroundColor: activeFilterCount > 0 ? '#E8EAF6' : 'transparent',
              borderRadius: '8px',
              px: 1,
              flexShrink: 0,
              '&:hover': { backgroundColor: '#E8EAF6' },
            }}
          >
            <TuneIcon sx={{ fontSize: 18 }} />
            {activeFilterCount > 0 && (
              <Typography
                component="span"
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: COLOR_PRIMARY_MAIN,
                  ml: 0.3,
                  lineHeight: 1,
                }}
              >
                {activeFilterCount}
              </Typography>
            )}
            {open ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        )}

        {/* アクション */}
        {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
      </Box>

      {/* ─── フィルタパネル ─── */}
      {hasFilters && (filtersOnly ? (
        /* フィルタのみモード: 常時展開・トグル不要 */
        <FilterPanel
          filters={filters}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
          showBorder
          hasActiveFilter={hasActiveFilter}
          onReset={onReset}
        />
      ) : (
        /* 検索 + フィルタ併用モード: 折りたたみ */
        <Collapse in={open}>
          <FilterPanel
            filters={filters}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            showBorder
            hasActiveFilter={hasActiveFilter}
            onReset={onReset}
          />
        </Collapse>
      ))}
    </Box>
  )
}
