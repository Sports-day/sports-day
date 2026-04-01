import { useState, useEffect } from 'react'
import { MOCK_IMAGES } from '../mock'

// モジュールレベルのリスナーセット（locations と同じパターン）
const _listeners = new Set<() => void>()

export function notifyImageListeners() {
  _listeners.forEach(fn => fn())
}

export function useImages() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const trigger = () => rerender(n => n + 1)
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  return { data: MOCK_IMAGES, loading: false, error: null }
}
