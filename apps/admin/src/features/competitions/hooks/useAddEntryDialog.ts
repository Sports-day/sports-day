import { useState } from 'react'

export function useAddEntryDialog(allIds: string[], onAdd: (selectedIds: string[]) => void) {
  const [selected, setSelected] = useState<string[]>([])

  const allSelected = selected.length === allIds.length && allIds.length > 0

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : [...allIds])
  }

  const handleAdd = (onClose: () => void) => {
    onAdd(selected)
    setSelected([])
    onClose()
  }

  return { selected, allSelected, toggle, toggleAll, handleAdd }
}
