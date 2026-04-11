import { useState, useCallback, useRef } from 'react'

type DnDItem = { id: string; displayOrder: number }

export function useDisplayOrderDnD<T extends DnDItem>(
  items: T[],
  onReorder: (input: { id: string; displayOrder: number }[]) => Promise<unknown>,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [orderedItems, setOrderedItems] = useState<T[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const dragIndexRef = useRef<number | null>(null)
  const orderedRef = useRef<T[]>([])

  const displayItems = isDirty ? orderedItems : items

  const handleDragStart = useCallback((index: number) => {
    const snapshot = [...items]
    setOrderedItems(snapshot)
    orderedRef.current = snapshot
    setDragIndex(index)
    dragIndexRef.current = index
    setIsDirty(true)
  }, [items])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
    const currentDragIndex = dragIndexRef.current
    if (currentDragIndex === null || currentDragIndex === index) return
    const newOrder = [...orderedRef.current]
    const [dragged] = newOrder.splice(currentDragIndex, 1)
    newOrder.splice(index, 0, dragged)
    orderedRef.current = newOrder
    setOrderedItems(newOrder)
    dragIndexRef.current = index
    setDragIndex(index)
  }, [])

  const handleDragEnd = useCallback(async () => {
    setDragIndex(null)
    dragIndexRef.current = null
    setDragOverIndex(null)
    const currentItems = orderedRef.current
    if (currentItems.length > 0) {
      const input = currentItems.map((item, i) => ({
        id: item.id,
        displayOrder: i + 1,
      }))
      await onReorder(input)
    }
    setIsDirty(false)
  }, [onReorder])

  return {
    displayItems,
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
