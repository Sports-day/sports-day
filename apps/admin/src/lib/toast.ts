/**
 * グローバルトースト通知の状態管理。
 * コンポーネントとは別ファイルにすることで react-refresh/only-export-components を回避。
 */

export type ToastType = 'success' | 'error' | 'warning'

export type ToastEntry = {
  id: number
  message: string
  type: ToastType
  duration: number
  createdAt: number
}

const DURATION: Record<ToastType, number> = {
  success: 3000,
  warning: 5000,
  error: 5000,
}

let _nextId = 0
const _listeners = new Set<() => void>()
let _queue: ToastEntry[] = []
let _suppressError = false

function _notify() {
  _listeners.forEach((fn) => fn())
}

export function showToast(message: string, type: ToastType = 'success') {
  const duration = DURATION[type]
  const entry: ToastEntry = { id: ++_nextId, message, type, duration, createdAt: Date.now() }
  _queue = [..._queue, entry]
  _notify()
  const id = _nextId
  setTimeout(() => dismissToast(id), duration)
}

export function showErrorToast(message = '操作に失敗しました。時間をおいて再度お試しください。') {
  if (_suppressError) {
    _suppressError = false
    return
  }
  showToast(message, 'error')
}

/**
 * GraphQL/Apollo エラーからユーザー向けメッセージを抽出してトーストで表示する。
 * バックエンドエラー形式 ": ERROR_CODE: 日本語メッセージ" からメッセージ部分を抽出する。
 */
export function showApiErrorToast(e: unknown) {
  const message = _extractApiErrorMessage(e)
  showErrorToast(message)
}

function _extractApiErrorMessage(e: unknown): string {
  if (e && typeof e === 'object') {
    const graphQLErrors = (e as Record<string, unknown>).graphQLErrors
    if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
      const raw = (graphQLErrors[0] as Record<string, unknown>).message
      if (typeof raw === 'string' && raw) {
        // ": ERROR_CODE: 日本語メッセージ " → "日本語メッセージ"
        const trimmed = raw.trim().replace(/^:\s*/, '')
        const match = trimmed.match(/^[A-Z_]+:\s*(.+)$/)
        if (match) return match[1].trim()
        return trimmed
      }
    }
  }
  return '操作に失敗しました。時間をおいて再度お試しください。'
}

export function showWarningToast(message: string) {
  showToast(message, 'warning')
  _suppressError = true
  setTimeout(() => { _suppressError = false }, 500)
}

/** 直後の showErrorToast 呼び出しを 1 回だけ抑制する（errorLink との二重表示防止用） */
export function suppressNextError() {
  _suppressError = true
  setTimeout(() => { _suppressError = false }, 500)
}

export function dismissToast(id: number) {
  _queue = _queue.filter((t) => t.id !== id)
  _notify()
}

export function getToastQueue(): ToastEntry[] {
  return _queue
}

export function subscribeToast(fn: () => void): () => void {
  _listeners.add(fn)
  return () => { _listeners.delete(fn) }
}
