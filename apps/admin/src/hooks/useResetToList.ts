import { createContext, useContext, useEffect, useRef } from 'react'

/**
 * サイドバーで同じページが再クリックされた時に一覧へ戻すための仕組み。
 *
 * App.tsx が resetKey（カウンター）を Context で配り、
 * 各ページが useResetToList(view, resetFn) で監視する。
 * resetKey が変わった時に view が一覧でなければ resetFn を呼ぶ。
 */

export const ResetToListContext = createContext(0)

export function useResetToList(isListView: boolean, resetFn: () => void) {
  const resetKey = useContext(ResetToListContext)
  const prevKey = useRef(resetKey)

  useEffect(() => {
    if (prevKey.current !== resetKey) {
      prevKey.current = resetKey
      if (!isListView) {
        resetFn()
      }
    }
  }, [resetKey, isListView, resetFn])
}
