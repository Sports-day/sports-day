import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'

const STORAGE_PREFIX = 'filter:'

/**
 * URL search params + sessionStorage でフィルター状態を永続化するフック。
 * - リロード → URL params から復元
 * - 別ページから戻る → sessionStorage から復元
 *
 * @param keys - 管理するフィルターキーの配列（例: ['keyword', 'type', 'sport']）
 */
export function useFilterParams(keys: readonly string[]) {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const storageKey = STORAGE_PREFIX + pathname
  const initialized = useRef(false)

  // マウント時: URL にフィルターがなければ sessionStorage から復元
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const hasAny = keys.some((k) => searchParams.has(k))
    if (hasAny) return

    const saved = sessionStorage.getItem(storageKey)
    if (!saved) return

    try {
      const obj = JSON.parse(saved) as Record<string, string>
      const next = new URLSearchParams(searchParams)
      let changed = false
      for (const key of keys) {
        if (obj[key]) {
          next.set(key, obj[key])
          changed = true
        }
      }
      if (changed) {
        setSearchParams(next, { replace: true })
      }
    } catch {
      // ignore
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // フィルター値が変わるたびに sessionStorage に保存
  const values: Record<string, string> = {}
  for (const key of keys) {
    values[key] = searchParams.get(key) ?? ''
  }

  useEffect(() => {
    const toSave: Record<string, string> = {}
    let hasValue = false
    for (const key of keys) {
      const v = searchParams.get(key) ?? ''
      if (v) {
        toSave[key] = v
        hasValue = true
      }
    }
    if (hasValue) {
      sessionStorage.setItem(storageKey, JSON.stringify(toSave))
    } else {
      sessionStorage.removeItem(storageKey)
    }
  }, [searchParams, storageKey, keys])

  const set = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        return next
      }, { replace: true })
    },
    [setSearchParams],
  )

  const reset = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const key of keys) {
        next.delete(key)
      }
      return next
    }, { replace: true })
    sessionStorage.removeItem(storageKey)
  }, [setSearchParams, keys, storageKey])

  return { values, set, reset } as const
}
