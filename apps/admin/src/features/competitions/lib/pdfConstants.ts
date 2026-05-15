export const MARGIN = 5
export const LINE_WIDTH = 0.1

export const FONT_SIZE = {
  TITLE: 18,
  HEADER: 14,
  CELL: 14,
  SMALL: 12,
} as const

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}
