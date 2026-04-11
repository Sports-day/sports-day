import { useState } from 'react'

export function useAddEntryDialog(allIds: string[], onAdd: (selectedIds: string[]) => void) {
  const [selected, setSelected] = useState<string[]>([])
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null)

  const allSelected = selected.length === allIds.length && allIds.length > 0

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : [...allIds])
  }

  const toggleExpand = (id: string) => {
    setExpandedTeamId(prev => prev === id ? null : id)
  }

  const handleAdd = async (onClose: () => void) => {
    await onAdd(selected)
    setSelected([])
    setExpandedTeamId(null)
    onClose()
  }

  return { selected, allSelected, expandedTeamId, toggle, toggleAll, toggleExpand, handleAdd }
}
