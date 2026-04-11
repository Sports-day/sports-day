import { useMemo } from 'react'
import { useGetAdminTeamsQuery, useGetAdminUsersQuery } from '@/gql/__generated__/graphql'

export type EntryTeamMember = {
  id: string
  name: string
  isExperienced: boolean
}

export type EntryTeam = {
  id: string
  name: string
  members: EntryTeamMember[]
  experiencedCount: number
}

export function useAddEntryTeams(sportId: string) {
  const { data: teamsData } = useGetAdminTeamsQuery()
  const { data: usersData } = useGetAdminUsersQuery()

  const teams: EntryTeam[] = useMemo(() => {
    const experiencedUserIds = new Set(
      (usersData?.allSportExperiences ?? [])
        .filter(e => sportId && e.sportId === sportId)
        .map(e => e.userId),
    )

    return (teamsData?.teams ?? []).map(t => {
      const members: EntryTeamMember[] = (t.users ?? []).map(u => ({
        id: u.id,
        name: '',
        isExperienced: sportId ? experiencedUserIds.has(u.id) : false,
      }))
      return {
        id: t.id,
        name: t.name,
        members,
        experiencedCount: members.filter(m => m.isExperienced).length,
      }
    })
  }, [teamsData, usersData, sportId])

  return { teams }
}
