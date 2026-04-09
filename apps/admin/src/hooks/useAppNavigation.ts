/**
 * アプリ全体のページ遷移を行うためのシンプルなコールバック管理。
 * App.tsx が setSelected を登録し、各ページコンポーネントから呼び出す。
 */

let navigateCallback: ((page: string, params?: Record<string, string>) => void) | null = null

export function registerNavigate(fn: (page: string, params?: Record<string, string>) => void) {
  navigateCallback = fn
}

export function navigateToPage(page: string, params?: Record<string, string>) {
  navigateCallback?.(page, params)
}
