/**
 * グローバルトースト通知の状態管理。
 * コンポーネントとは別ファイルにすることで react-refresh/only-export-components を回避。
 */

type ToastEntry = { id: number; message: string }

let _nextId = 0
const _listeners = new Set<() => void>()
let _queue: ToastEntry[] = []

export function showToast(message: string) {
  _queue = [..._queue, { id: ++_nextId, message }]
  _listeners.forEach((fn) => fn())
  const id = _nextId
  setTimeout(() => {
    dismissToast(id)
  }, 3000)
}

export function dismissToast(id: number) {
  _queue = _queue.filter((t) => t.id !== id)
  _listeners.forEach((fn) => fn())
}

export function getToastQueue(): ToastEntry[] {
  return _queue
}

export function subscribeToast(fn: () => void): () => void {
  _listeners.add(fn)
  return () => { _listeners.delete(fn) }
}
