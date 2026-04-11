import type { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CompetitionPdfData } from '../hooks/useCompetitionPdfData'
import { LEAGUE_COLORS } from '../hooks/useCompetitionPdfData'
import { hexToRgb, FONT_SIZE, MARGIN, LINE_WIDTH } from './pdfConstants'
import { FONT_NAME } from './pdfFontSetup'

// A4幅 210mm, マージン5mm×2 = 使用可能幅200mm
// 2列: 各列幅95mm, 列間ギャップ10mm
const COL_WIDTH = 95
const COL_GAP = 10
const COL_LEFT_X = MARGIN
const COL_RIGHT_X = MARGIN + COL_WIDTH + COL_GAP
const PAGE_BOTTOM = 287 // A4高さ297mm - マージン10mm

export function renderLeagueTableSheet(doc: jsPDF, data: CompetitionPdfData): void {
  doc.setFont(FONT_NAME)
  doc.setFontSize(FONT_SIZE.TITLE)
  doc.text(`${data.sportName}  ${data.sceneName}  リーグ表`, 105, 10, { align: 'center' })

  // 左列から開始、入りきらなければ右列、それでも入らなければ改ページ
  let col: 'left' | 'right' = 'left'
  let leftY = 16
  let rightY = 16

  for (const league of data.leagues) {
    const bgColor = hexToRgb(LEAGUE_COLORS[league.colorIndex].bg)
    const teams = league.teams

    const leagueNameRow = [{
      content: league.name,
      colSpan: teams.length + 1,
      styles: { halign: 'center' as const, fillColor: bgColor, textColor: [0, 0, 0] as [number, number, number] },
    }]
    const teamNameRow = ['', ...teams.map((t) => t.name)]

    const body = teams.map((rowTeam) => {
      return [rowTeam.name, ...teams.map(() => '')]
    })

    // テーブル高さを事前推定（ヘッダー2行 + ボディN行）× セル高さ
    const estimatedHeight = (2 + teams.length) * 8 + 4

    // 配置先を決定
    let startX: number
    let startY: number

    if (col === 'left') {
      if (leftY + estimatedHeight > PAGE_BOTTOM && leftY > 16) {
        // 左列に入りきらない → 右列を試す
        col = 'right'
      }
    }

    if (col === 'left') {
      startX = COL_LEFT_X
      startY = leftY
    } else {
      if (rightY + estimatedHeight > PAGE_BOTTOM && rightY > 16) {
        // 右列にも入りきらない → 改ページして左列に戻る
        doc.addPage()
        leftY = 10
        rightY = 10
        col = 'left'
      }
      startX = col === 'left' ? COL_LEFT_X : COL_RIGHT_X
      startY = col === 'left' ? leftY : rightY
    }

    autoTable(doc, {
      startY,
      margin: { left: startX, right: 210 - startX - COL_WIDTH },
      tableWidth: COL_WIDTH,
      head: [leagueNameRow, teamNameRow],
      body,
      styles: {
        font: FONT_NAME,
        fontSize: FONT_SIZE.CELL,
        cellPadding: 1.5,
        lineWidth: LINE_WIDTH,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        minCellHeight: 8,
      },
      headStyles: {
        fillColor: bgColor,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        halign: 'center',
        fontSize: FONT_SIZE.HEADER,
      },
      columnStyles: {
        0: { fillColor: bgColor, halign: 'center' },
      },
      theme: 'grid',
      didDrawCell: (hookData) => {
        if (hookData.section === 'body') {
          const ri = hookData.row.index
          const ci = hookData.column.index
          if (ci === ri + 1) {
            const { x, y, width, height } = hookData.cell
            doc.setDrawColor(0, 0, 0)
            doc.setLineWidth(LINE_WIDTH)
            doc.line(x, y, x + width, y + height)
          }
        }
      },
    })

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6

    if (col === 'left') {
      leftY = finalY
      col = 'right'
    } else {
      rightY = finalY
      col = 'left'
    }
  }
}
