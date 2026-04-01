import { useEffect, useRef } from 'react'

/**
 * フォームに未保存の変更がある場合、ページ離脱時にブラウザ警告を出すフック。
 * @param dirty - フォームが変更されているかどうか
 */
export function useUnsavedWarning(dirty: boolean) {
  const dirtyRef = useRef(dirty)

  useEffect(() => {
    dirtyRef.current = dirty
  }, [dirty])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])
}
