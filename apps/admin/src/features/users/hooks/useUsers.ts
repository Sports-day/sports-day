import { useMemo, useCallback } from 'react'
import { useGetAdminUsersQuery } from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { User } from '../types'

export function useUsers() {
  const { data, loading, error } = useGetAdminUsersQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'role', 'group'])

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
    const mail = msUser?.mail ?? u.email ?? ''
    const localPart = mail.split('@')[0] ?? ''
    const studentNumber = localPart.replace(/^[a-zA-Z]+/, '')
    return {
      id: u.id,
      name: msUser?.displayName ?? u.name ?? '',
      email: mail,
      studentNumber,
      role: u.role,
      groupName: u.groups[0]?.name ?? '',
      teams: u.teams.map((t) => ({ id: t.id, name: t.name })),
      experiencedSports: userExpMap.get(u.id) ?? [],
      microsoftUserId: u.identify?.microsoftUserId,
    }
  })

  const keyword = fp.keyword
  const roleFilter = fp.role
  const groupFilter = fp.group

  const groupOptions = useMemo(() => {
    const set = new Map<string, string>()
    for (const u of users) {
      if (u.groupName && !set.has(u.groupName)) set.set(u.groupName, u.groupName)
    }
    return Array.from(set, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [users])

  const filtered = useMemo(() => {
    let result = users
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw) ||
        u.groupName.toLowerCase().includes(kw) ||
        u.teams.some(t => t.name.toLowerCase().includes(kw))
      )
    }
    if (roleFilter) result = result.filter(u => u.role === roleFilter)
    if (groupFilter) result = result.filter(u => u.groupName === groupFilter)
    return result
  }, [users, keyword, roleFilter, groupFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  return {
    data: filtered,
    allData: users,
    keyword,
    roleFilter,
    groupFilter,
    groupOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading: loading || msGraphLoading,
    error: error ?? null,
  }
}
