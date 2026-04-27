import { useMemo } from 'react'
import { useGetAdminTeamsQuery, useGetAdminUsersQuery, useGetAdminSportSceneEntriesQuery } from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'

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

export function useAddEntryTeams(sportId: string, sceneId: string) {
  const { data: teamsData } = useGetAdminTeamsQuery()
  const { data: usersData } = useGetAdminUsersQuery()
  const { data: sceneData, loading: sceneLoading } = useGetAdminSportSceneEntriesQuery({
    variables: { sceneId },
    skip: !sceneId,
  })

  const allUserMsIds = useMemo(() => {
    return (teamsData?.teams ?? [])
      .flatMap(t => t.users ?? [])
      .map(u => u.identify?.microsoftUserId)
      .filter((id): id is string => !!id)
  }, [teamsData])

  const { msGraphUsers } = useMsGraphUsers(allUserMsIds)

  const teams: EntryTeam[] = useMemo(() => {
    // sportId・sceneIdが両方揃っている場合のみ、SportEntryでフィルタリング
    const registeredTeamIds = new Set<string>()
    if (sportId && sceneId && sceneData?.scene) {
      for (const sportScene of sceneData.scene.sportScenes) {
        if (sportScene.sport.id === sportId) {
          for (const entry of sportScene.entries) {
            registeredTeamIds.add(entry.team.id)
          }
        }
      }
    }
    const shouldFilter = sportId && sceneId && sceneData?.scene != null

    const experiencedUserIds = new Set(
      (usersData?.allSportExperiences ?? [])
        .filter(e => sportId && e.sportId === sportId)
        .map(e => e.userId),
    )

    return (teamsData?.teams ?? [])
      .filter(t => !shouldFilter || registeredTeamIds.has(t.id))
      .map(t => {
        const members: EntryTeamMember[] = (t.users ?? []).map(u => {
          const msUser = u.identify?.microsoftUserId ? msGraphUsers.get(u.identify.microsoftUserId) : undefined
          return {
            id: u.id,
            name: msUser?.displayName ?? u.name ?? '',
            isExperienced: sportId ? experiencedUserIds.has(u.id) : false,
          }
        })
        return {
          id: t.id,
          name: t.name,
          members,
          experiencedCount: members.filter(m => m.isExperienced).length,
        }
      })
  }, [teamsData, usersData, sceneData, sportId, sceneId, msGraphUsers])

  const loading = !!sceneId && sceneLoading && sceneData == null

  return { teams, loading }
}
