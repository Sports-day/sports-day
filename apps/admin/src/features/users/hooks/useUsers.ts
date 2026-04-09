import { useMemo } from 'react'
import { useGetAdminUsersQuery } from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'
import type { User } from '../types'

export function useUsers() {
  const { data, loading, error } = useGetAdminUsersQuery()

  const microsoftUserIds = useMemo(
    () =>
      (data?.users ?? [])
        .map((u) => u.identify?.microsoftUserId)
        .filter((id): id is string => !!id),
    [data],
  )

  const { msGraphUsers, loading: msGraphLoading } =
    useMsGraphUsers(microsoftUserIds)

  const sportMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const s of data?.sports ?? []) m.set(s.id, s.name)
    return m
  }, [data?.sports])

  const userExpMap = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const e of data?.allSportExperiences ?? []) {
      const name = sportMap.get(e.sportId)
      if (!name) continue
      const arr = m.get(e.userId) ?? []
      arr.push(name)
      m.set(e.userId, arr)
    }
    return m
  }, [data?.allSportExperiences, sportMap])

  const users: User[] = (data?.users ?? []).map((u) => {
    const msUser = u.identify?.microsoftUserId
      ? msGraphUsers.get(u.identify.microsoftUserId)
      : undefined
    return {
      id: u.id,
      name: msUser?.displayName ?? u.name,
      email: msUser?.mail ?? u.email,
      gender: u.gender ?? '',
      role: u.role,
      groupName: u.groups[0]?.name ?? '',
      teams: u.teams.map((t) => ({ id: t.id, name: t.name })),
      experiencedSports: userExpMap.get(u.id) ?? [],
      microsoftUserId: u.identify?.microsoftUserId,
    }
  })

  return { data: users, loading: loading || msGraphLoading, error: error ?? null }
}
