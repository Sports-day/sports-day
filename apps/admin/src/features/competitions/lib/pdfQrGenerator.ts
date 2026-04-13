import { jsPDF } from 'jspdf'
import QRCodeStyling from 'qr-code-styling'
import type { QrPdfData } from '../hooks/useQrPdfData'
import { setupJapaneseFont } from './pdfFontSetup'

// A4: 210 x 297 mm
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const QR_SIZE = 150 // mm — 余白をしっかり確保
const QR_RESOLUTION = 2000 // px — 高解像度レンダリング

async function generateQrPngDataUrl(url: string): Promise<string> {
  const qr = new QRCodeStyling({
    width: QR_RESOLUTION,
    height: QR_RESOLUTION,
    data: url,
    type: 'canvas',
    dotsOptions: {
      type: 'rounded',
      gradient: {
        type: 'linear',
        rotation: 135 * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: '#5D6EC6' },
          { offset: 1, color: '#3F4DB3' },
        ],
      },
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      gradient: {
        type: 'linear',
        rotation: 135 * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: '#5D6EC6' },
          { offset: 1, color: '#3F4DB3' },
        ],
      },
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#3F4DB3',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
  })

  const blob = await qr.getRawData('png')
  if (!blob) throw new Error('QR PNG generation failed')

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob as Blob)
  })
}

async function buildQrPdfDoc(data: QrPdfData): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await setupJapaneseFont(doc)

  for (let i = 0; i < data.locations.length; i++) {
    if (i > 0) doc.addPage()

    const loc = data.locations[i]
    const url = `${data.panelUrl}/judge/${loc.id}`

    // QR + ラベル全体の高さを計算してページ中央に配置
    const labelGap = 12
    const labelHeight = 15 // 場所名 + コピーライト分
    const totalHeight = QR_SIZE + labelGap + labelHeight
    const qrX = (PAGE_WIDTH - QR_SIZE) / 2
    const qrY = (PAGE_HEIGHT - totalHeight) / 2

    // 高解像度PNGとしてPDFに埋め込み
    const pngDataUrl = await generateQrPngDataUrl(url)
    doc.addImage(pngDataUrl, 'PNG', qrX, qrY, QR_SIZE, QR_SIZE)

    // 場所名（大きめ）
    const nameLabelY = qrY + QR_SIZE + labelGap
    doc.setFontSize(28)
    doc.setTextColor(47, 60, 140) // #2F3C8C
    doc.text(loc.name, PAGE_WIDTH / 2, nameLabelY, { align: 'center' })

    // コピーライト
    doc.setFontSize(9)
    doc.setTextColor(160, 160, 180)
    doc.text('© wider', PAGE_WIDTH / 2, nameLabelY + 10, { align: 'center' })
  }

  return doc
}

export async function generateQrPdfBlob(data: QrPdfData): Promise<string> {
  const doc = await buildQrPdfDoc(data)
  const blob = doc.output('blob')
  return URL.createObjectURL(blob)
}

export async function downloadQrPdf(data: QrPdfData): Promise<void> {
  const doc = await buildQrPdfDoc(data)
  doc.save(`${data.competitionName}_QRコード.pdf`)
}
