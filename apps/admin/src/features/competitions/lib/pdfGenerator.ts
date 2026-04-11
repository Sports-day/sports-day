import { jsPDF } from 'jspdf'
import type { CompetitionPdfData } from '../hooks/useCompetitionPdfData'
import { setupJapaneseFont } from './pdfFontSetup'
import { renderMemberSheet } from './pdfMemberSheet'
import { renderLeagueTableSheet } from './pdfLeagueTableSheet'
import { renderScheduleSheet } from './pdfScheduleSheet'

async function buildPdfDoc(data: CompetitionPdfData): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await setupJapaneseFont(doc)

  // Sheet 1: メンバー表
  renderMemberSheet(doc, data)

  // Sheet 2: リーグ表
  doc.addPage()
  renderLeagueTableSheet(doc, data)

  // Sheet 3: タイムスケジュール
  doc.addPage()
  renderScheduleSheet(doc, data)

  return doc
}

export async function generateCompetitionPdfBlob(data: CompetitionPdfData): Promise<string> {
  const doc = await buildPdfDoc(data)
  const blob = doc.output('blob')
  return URL.createObjectURL(blob)
}

export async function downloadCompetitionPdf(data: CompetitionPdfData): Promise<void> {
  const doc = await buildPdfDoc(data)
  doc.save(`${data.sportName}_${data.sceneName}_資料.pdf`)
}
