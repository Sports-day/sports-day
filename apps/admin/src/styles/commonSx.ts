// カードのグラデーション背景
export const CARD_GRADIENT = 'linear-gradient(to bottom, #E0E3F5 30%, #D2D6ED 70%)'

// グラデーションカード内テーブル（透明背景）
export const CARD_TABLE_HEAD_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#2F3C8C',
  backgroundColor: 'transparent',
  borderBottom: '1px solid #5B6DC6',
  borderLeft: 'none',
  borderRight: 'none',
  borderTop: 'none',
}

export const CARD_TABLE_CELL_SX = {
  fontSize: '13px',
  color: '#2F3C8C',
  backgroundColor: 'transparent',
  border: 'none',
}

// リスト・ダイアログ内テーブル（白背景）
export const LIST_TABLE_HEAD_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D6D6D6',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const LIST_TABLE_CELL_SX = {
  fontSize: '13px',
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D6D6D6',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

// グラデーションカード内 TextField
export const CARD_FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
  },
  '& .MuiInputBase-input': { color: '#2F3C8C', fontSize: '14px' },
  '& .MuiInputLabel-root': { color: '#2F3C8C', opacity: 0.7 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C', opacity: 1 },
  '& .MuiInputLabel-shrink': { opacity: 1 },
}

// ヘッダーアクションボタン（一覧画面の「新規作成」等、小さめ）
export const ACTION_BUTTON_SX = {
  backgroundColor: '#3949AB',
  color: '#FFFFFF',
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#2F3C8C', boxShadow: 'none' },
}

// 保存ボタン（フォーム・編集画面用、大きめ）
export const SAVE_BUTTON_SX = {
  backgroundColor: '#3949AB',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: 600,
  height: '40px',
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#2F3C8C', boxShadow: 'none' },
}

// 削除ボタン（outlined）
export const DELETE_BUTTON_SX = {
  backgroundColor: 'transparent',
  color: '#D71212',
  borderColor: '#D71212',
  boxShadow: 'none',
  whiteSpace: 'nowrap' as const,
  height: '40px',
  fontSize: '13px',
  '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
}

// パンくずリスト
export const BREADCRUMB_LINK_SX = {
  fontSize: '16px',
  color: '#2F3C8C',
  cursor: 'pointer',
  '&:hover': { opacity: 0.7 },
}

export const BREADCRUMB_CURRENT_SX = {
  fontSize: '16px',
  color: '#2F3C8C',
}
