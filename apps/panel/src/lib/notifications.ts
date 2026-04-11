/**
 * 通知イベント基盤（将来PWAプッシュ通知に差し替え可能）
 */

export type NotificationEvent =
  | { type: 'MATCH_APPROACHING'; matchId: string; minutesBefore: number }
  | { type: 'MATCH_FINISHED'; matchId: string }

type NotificationListener = (event: NotificationEvent) => void

const listeners = new Set<NotificationListener>()

export function subscribe(callback: NotificationListener): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function notify(event: NotificationEvent): void {
  listeners.forEach((cb) => cb(event))
}
