import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** pathname ごとにフィルター値を保持するモジュールレベルStore */
const store = new Map<string, Record<string, string>>()

/**
 * モジュールレベル Store でフィルター状態を保持するフック。
 * - コンポーネントのアンマウント・再マウントでも値が残る
 * - ページ遷移で別ページに行っても pathname 単位で保持される
 * - ブラウザリロードではリセットされる
 *
 * @param keys - 管理するフィルターキーの配列（例: ['keyword', 'type', 'sport']）
 * @param defaults - 初回アクセス時に適用するデフォルト値
 */
export function useFilterParams(keys: readonly string[], defaults?: Readonly<Record<string, string>>) {
  const { pathname } = useLocation()

  const getStored = (): Record<string, string> => {
    const saved = store.get(pathname)
    const result: Record<string, string> = {}
    for (const key of keys) {
      result[key] = saved?.[key] ?? defaults?.[key] ?? ''
    }
    return result
  }

  const [values, setValues] = useState<Record<string, string>>(getStored)

  const set = useCallback(
    (key: string, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value }
        store.set(pathname, next)
        return next
      })
    },
    [pathname],
  )

  const reset = useCallback(() => {
    const empty: Record<string, string> = {}
    for (const key of keys) {
      empty[key] = ''
    }
    store.delete(pathname)
    setValues(empty)
  }, [pathname, keys])

  return { values, set, reset } as const
}
