import type { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CompetitionPdfData } from '../hooks/useCompetitionPdfData'
import { LEAGUE_COLORS } from '../hooks/useCompetitionPdfData'
import { hexToRgb, FONT_SIZE, MARGIN, LINE_WIDTH } from './pdfConstants'
import { FONT_NAME } from './pdfFontSetup'

export function renderMemberSheet(doc: jsPDF, data: CompetitionPdfData): void {
  doc.setFont(FONT_NAME)
  doc.setFontSize(FONT_SIZE.TITLE)
  doc.text(`${data.sportName}  ${data.sceneName}  メンバー表`, 105, 10, { align: 'center' })

  let startY = 16

  for (const league of data.leagues) {
    const bgColor = hexToRgb(LEAGUE_COLORS[league.colorIndex].bg)
    const maxMembers = Math.max(...league.teams.map((t) => t.members.length), 0)

    const head: string[][] = [league.teams.map((t) => t.name)]
    const body: string[][] = []
    for (let i = 0; i < maxMembers; i++) {
      body.push(league.teams.map((t) => t.members[i]?.name ?? ''))
    }

    autoTable(doc, {
      startY,
      margin: { left: MARGIN, right: MARGIN },
      head: [[{ content: league.name, colSpan: league.teams.length, styles: { halign: 'center', fillColor: bgColor, textColor: [0, 0, 0] } }], ...head],
      body,
      styles: {
        font: FONT_NAME,
        fontSize: FONT_SIZE.CELL,
        cellPadding: 1.5,
        lineWidth: LINE_WIDTH,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: bgColor,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        halign: 'center',
        fontSize: FONT_SIZE.HEADER,
      },
      theme: 'grid',
    })

    startY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4
  }
}
