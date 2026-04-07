import { useState } from 'react'
import {
  useSetAdminTiebreakPrioritiesMutation,
  GetAdminLeagueStandingsDocument,
} from '@/gql/__generated__/graphql'

type TiedTeam = {
  id: string
  name: string
  rank: number
}

export function useTiebreak(leagueId: string) {
  const [order, setOrder] = useState<TiedTeam[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const [setTiebreakPriorities, { loading }] = useSetAdminTiebreakPrioritiesMutation({
    refetchQueries: [{ query: GetAdminLeagueStandingsDocument, variables: { leagueId } }],
  })

  const initOrder = (teams: TiedTeam[]) => {
    setOrder(teams)
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const newOrder = [...order]
    const [dragged] = newOrder.splice(dragIndex, 1)
    newOrder.splice(index, 0, dragged)
    setOrder(newOrder)
    setDragIndex(index)
  }

  const handleDragEnd = () => setDragIndex(null)

  const handleSave = async () => {
    await setTiebreakPriorities({
      variables: {
        leagueId,
        priorities: order.map((team, i) => ({
          teamId: team.id,
          priority: i + 1,
        })),
      },
    })
  }

  return {
    order,
    dragIndex,
    initOrder,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleSave,
    loading,
  }
}
