import type { jsPDF } from 'jspdf'
import autoTable, { type CellDef } from 'jspdf-autotable'
import type { CompetitionPdfData, PdfScheduleMatch } from '../hooks/useCompetitionPdfData'
import { LEAGUE_COLORS } from '../hooks/useCompetitionPdfData'
import { hexToRgb, FONT_SIZE, MARGIN, LINE_WIDTH } from './pdfConstants'
import { FONT_NAME } from './pdfFontSetup'

type MatchGroup = { timeLabel: string; matches: PdfScheduleMatch[] }

// A4 portrait 使用可能幅
const PAGE_WIDTH = 210 - MARGIN * 2 // 200mm

// 固定列の幅
const TIME_COL_W = 12
const NO_COL_W = 7

export function renderScheduleSheet(doc: jsPDF, data: CompetitionPdfData): void {
  doc.setFont(FONT_NAME)
  doc.setFontSize(FONT_SIZE.TITLE)
  doc.text(`${data.sportName}  ${data.sceneName}  対戦スケジュール`, 105, 10, { align: 'center' })

  const { schedule, locations } = data
  if (schedule.length === 0) return

  const groups = groupByTime(schedule)
  const { prelimGroups, finalGroups } = splitPrelimFinal(groups)
  const totalCols = 2 + locations.length * 2

  // 会場数に応じてフォントサイズを動的に決定
  // 残り幅 = PAGE_WIDTH - TIME_COL_W - NO_COL_W
  // 対戦列と審判列のペア数 = locations.length
  const remainW = PAGE_WIDTH - TIME_COL_W - NO_COL_W
  const pairWidth = remainW / locations.length // 1会場あたりの幅(対戦+審判)
  const matchColW = pairWidth * 0.7
  const refColW = pairWidth * 0.3

  // 幅が狭い場合はフォントを縮小
  let fontSize = FONT_SIZE.SMALL // 6
  if (pairWidth < 30) fontSize = 4.5
  else if (pairWidth < 40) fontSize = 5

  // カラムスタイルを動���に構築
  const colStyles: Record<number, { cellWidth: number; halign: 'center' }> = {
    0: { cellWidth: TIME_COL_W, halign: 'center' },
    1: { cellWidth: NO_COL_W, halign: 'center' },
  }
  for (let i = 0; i < locations.length; i++) {
    const baseIdx = 2 + i * 2
    colStyles[baseIdx] = { cellWidth: matchColW, halign: 'center' }
    colStyles[baseIdx + 1] = { cellWidth: refColW, halign: 'center' }
  }

  const head: (string | CellDef)[][] = [
    ['時間', 'No', ...locations.flatMap((loc) => [loc, '審判'])],
  ]

  const body: (string | CellDef)[][] = []

  for (const g of prelimGroups) {
    body.push(buildScheduleRow(g, locations))
  }

  if (finalGroups.length > 0) {
    body.push([{
      content: '予選集計 / 決勝準備',
      colSpan: totalCols,
      styles: { halign: 'center', fillColor: [240, 240, 240] },
    }])
    for (const g of finalGroups) {
      body.push(buildScheduleRow(g, locations))
    }
  }

  autoTable(doc, {
    startY: 16,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: PAGE_WIDTH,
    head,
    body,
    styles: {
      font: FONT_NAME,
      fontSize,
      cellPadding: 0.8,
      lineWidth: LINE_WIDTH,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      overflow: 'linebreak',
      cellWidth: 'wrap',
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'normal',
      halign: 'center',
      fontSize,
    },
    columnStyles: colStyles,
    theme: 'grid',
  })
}

function buildScheduleRow(
  group: MatchGroup,
  locations: string[],
): (string | CellDef)[] {
  const matchByLoc = new Map<string, PdfScheduleMatch>()
  for (const m of group.matches) matchByLoc.set(m.locationName, m)

  const row: (string | CellDef)[] = [
    { content: group.timeLabel, styles: { halign: 'center' } },
    { content: group.matches.map((m) => String(m.orderNumber)).join(','), styles: { halign: 'center' } },
  ]

  for (const loc of locations) {
    const m = matchByLoc.get(loc)
    if (!m) {
      row.push('', '')
    } else {
      const bg = hexToRgb(LEAGUE_COLORS[m.leagueColorIndex].bg)
      row.push(
        { content: `${m.teamA} x ${m.teamB}`, styles: { fillColor: bg, halign: 'center' } },
        { content: m.judgmentLabel, styles: { fillColor: bg, halign: 'center' } },
      )
    }
  }
  return row
}

function groupByTime(schedule: PdfScheduleMatch[]): MatchGroup[] {
  const groups: MatchGroup[] = []
  for (const m of schedule) {
    const last = groups[groups.length - 1]
    if (last && last.timeLabel === m.timeLabel) {
      last.matches.push(m)
    } else {
      groups.push({ timeLabel: m.timeLabel, matches: [m] })
    }
  }
  return groups
}

function splitPrelimFinal(groups: MatchGroup[]): { prelimGroups: MatchGroup[]; finalGroups: MatchGroup[] } {
  let splitIdx = -1
  for (let i = 1; i < groups.length; i++) {
    const prevTime = new Date(groups[i - 1].matches[0].time).getTime()
    const currTime = new Date(groups[i].matches[0].time).getTime()
    if (currTime - prevTime > 60 * 60 * 1000) {
      splitIdx = i
      break
    }
  }
  return {
    prelimGroups: splitIdx >= 0 ? groups.slice(0, splitIdx) : groups,
    finalGroups: splitIdx >= 0 ? groups.slice(splitIdx) : [],
  }
}
