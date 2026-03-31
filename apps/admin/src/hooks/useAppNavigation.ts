/**
 * アプリ全体のページ遷移を行うためのシンプルなコールバック管理。
 * App.tsx が setSelected を登録し、各ページコンポーネントから呼び出す。
 */

let navigateCallback: ((page: string) => void) | null = null

export function registerNavigate(fn: (page: string) => void) {
  navigateCallback = fn
}

export function navigateToPage(page: string) {
  navigateCallback?.(page)
}
