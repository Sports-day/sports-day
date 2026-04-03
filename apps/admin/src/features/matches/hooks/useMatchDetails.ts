import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { useUpdateAdminMatchDetailMutation } from '@/gql/__generated__/graphql'

export function useMatchDetails(match: ActiveMatch) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(match.note ?? '')
  const [referee, setReferee] = useState(match.referee ?? '')
  const [location, setLocation] = useState(match.location ?? '1')
  const [startTime, setStartTime] = useState(match.startTime ?? new Date().toISOString().slice(0, 16))

  const [updateMatchDetail] = useUpdateAdminMatchDetailMutation()

  const handleSave = () => {
    // 【未確定】 note, referee は GraphQL UpdateMatchDetailInput に存在しない
    // locationId は location 名から ID への変換が必要
    updateMatchDetail({
      variables: {
        id: match.id,
        input: {
          time: startTime,
          // locationId: 【未確定】location 名から ID への逆引きが必要
        },
      },
      refetchQueries: ['GetAdminMatches'],
    }).then(() => setOpen(false)).catch(() => {})
  }

  const handleReset = () => {
    setNote(match.note ?? '')
    setReferee(match.referee ?? '')
    setLocation(match.location ?? '1')
    setStartTime(match.startTime ?? new Date().toISOString().slice(0, 16))
  }

  return {
    open,
    setOpen,
    note,
    setNote,
    referee,
    setReferee,
    location,
    setLocation,
    startTime,
    setStartTime,
    handleSave,
    handleReset,
  }
}
