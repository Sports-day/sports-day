import type { jsPDF } from 'jspdf'

const FONT_NAME = 'NotoSansJP'

let cachedBase64: string | null = null

export async function setupJapaneseFont(doc: jsPDF): Promise<void> {
  if (!cachedBase64) {
    const res = await fetch('/fonts/NotoSansJP-Regular.ttf')
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`)
    const buf = await res.arrayBuffer()
    // Blob + FileReader で確実に base64 変換
    cachedBase64 = await arrayBufferToBase64(buf)
  }

  doc.addFileToVFS('NotoSansJP-Regular.ttf', cachedBase64)
  doc.addFont('NotoSansJP-Regular.ttf', FONT_NAME, 'normal')
  doc.setFont(FONT_NAME, 'normal')
}

export { FONT_NAME }

function arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer])
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      // "data:application/octet-stream;base64,XXXX" から base64 部分だけ取り出す
      resolve(dataUrl.split(',')[1])
    }
    reader.onerror = () => reject(new Error('Failed to convert font to base64'))
    reader.readAsDataURL(blob)
  })
}
