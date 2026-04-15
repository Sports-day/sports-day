import {
  COLOR_PRIMARY_DARK,
  COLOR_PRIMARY_BUTTON,
  COLOR_BORDER,
  COLOR_ERROR,
  COLOR_BG_WHITE,
  COLOR_DIVIDER,
} from './colors'

// カードのグラデーション背景
export const CARD_GRADIENT = 'linear-gradient(to bottom, #E0E3F5 30%, #D2D6ED 70%)'

// グラデーションカード内テーブル コンテナ（テキストオーバーフロー対応）
export const CARD_TABLE_SX = {
  tableLayout: 'fixed' as const,
  width: '100%',
}

// グラデーションカード内テーブル（透明背景）
export const CARD_TABLE_HEAD_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: COLOR_PRIMARY_DARK,
  backgroundColor: 'transparent',
  borderBottom: `1px solid ${COLOR_BORDER}`,
  borderLeft: 'none',
  borderRight: 'none',
  borderTop: 'none',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const CARD_TABLE_CELL_SX = {
  fontSize: '13px',
  color: COLOR_PRIMARY_DARK,
  backgroundColor: 'transparent',
  border: 'none',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

// リスト・ダイアログ内テーブル コンテナ（テキストオーバーフロー対応）
export const LIST_TABLE_SX = {
  backgroundColor: '#FFFFFF',
  borderRadius: 1,
  overflow: 'hidden',
  width: '100%',
  tableLayout: 'fixed' as const,
}

// リスト・ダイアログ内テーブル（白背景）
export const LIST_TABLE_HEAD_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: COLOR_PRIMARY_DARK,
  backgroundColor: COLOR_BG_WHITE,
  borderBottom: `1px solid ${COLOR_DIVIDER}`,
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const LIST_TABLE_CELL_SX = {
  fontSize: '13px',
  color: COLOR_PRIMARY_DARK,
  backgroundColor: COLOR_BG_WHITE,
  borderBottom: `1px solid ${COLOR_DIVIDER}`,
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  'tr:last-child &': { borderBottom: 'none' },
}

// グラデーションカード内 TextField（label あり）
export const CARD_FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: COLOR_BORDER, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: COLOR_BORDER },
    '&.Mui-focused fieldset': { borderColor: COLOR_BORDER },
  },
  '& .MuiInputBase-input': { color: COLOR_PRIMARY_DARK, fontSize: '14px' },
  '& .MuiInputLabel-root': { color: COLOR_PRIMARY_DARK, opacity: 0.7 },
  '& .MuiInputLabel-root.Mui-focused': { color: COLOR_PRIMARY_DARK, opacity: 1 },
  '& .MuiInputLabel-shrink': { opacity: 1 },
}

// グラデーションカード内 TextField（placeholder あり、作成フォーム用）
export const CARD_FIELD_CREATE_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    borderRadius: '10px',
    '& fieldset': { borderColor: COLOR_BORDER, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: COLOR_BORDER },
    '&.Mui-focused fieldset': { borderColor: COLOR_BORDER },
  },
  '& input::placeholder': { color: COLOR_PRIMARY_DARK, opacity: 0.5 },
  '& .MuiInputLabel-root': { color: COLOR_PRIMARY_DARK, opacity: 0.7 },
  '& .MuiInputLabel-root.Mui-focused': { color: COLOR_PRIMARY_DARK },
}

// ヘッダーアクションボタン（一覧画面の「新規作成」等、小さめ）
export const ACTION_BUTTON_SX = {
  backgroundColor: COLOR_PRIMARY_BUTTON,
  px: 2,
  boxShadow: 'none',
  '&:hover': { backgroundColor: COLOR_PRIMARY_DARK, boxShadow: 'none' },
}

// 保存ボタン（フォーム・編集画面用、大きめ）
export const SAVE_BUTTON_SX = {
  backgroundColor: COLOR_PRIMARY_BUTTON,
  fontSize: '16px',
  fontWeight: 600,
  height: '40px',
  boxShadow: 'none',
  '&:hover': { backgroundColor: COLOR_PRIMARY_DARK, boxShadow: 'none' },
}

// 削除ボタン（outlined）
export const DELETE_BUTTON_SX = {
  backgroundColor: 'transparent',
  color: COLOR_ERROR,
  borderColor: COLOR_ERROR,
  boxShadow: 'none',
  whiteSpace: 'nowrap' as const,
  height: '40px',
  fontSize: '13px',
  '&:hover': { backgroundColor: '#FDECEA', borderColor: COLOR_ERROR },
}

// パンくずリスト
export const BREADCRUMB_LINK_SX = {
  fontSize: '16px',
  color: COLOR_PRIMARY_DARK,
  cursor: 'pointer',
  '&:hover': { opacity: 0.7 },
}

export const BREADCRUMB_CURRENT_SX = {
  fontSize: '16px',
  color: COLOR_PRIMARY_DARK,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
  maxWidth: '40vw',
}
