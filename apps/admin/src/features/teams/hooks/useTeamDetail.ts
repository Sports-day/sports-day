import { useState, useMemo } from 'react'
import {
  useGetAdminTeamQuery,
  useGetAdminUsersQuery,
  useUpdateAdminTeamMutation,
  useDeleteAdminTeamMutation,
  useUpdateAdminTeamUsersMutation,
  useGetAdminGroupsQuery,
} from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'
import { showErrorToast } from '@/lib/toast'
import type { TeamMember, SelectableUser } from '../types'

export function useTeamDetail(teamId: string) {
  const { data, loading, error } = useGetAdminTeamQuery({
    variables: { id: teamId },
    skip: !teamId,
  })
  const { data: usersData } = useGetAdminUsersQuery()
  const { data: groupsData } = useGetAdminGroupsQuery()

  const team = data?.team

  // ユーザーID → microsoftUserId のマップを作成
  const msIdMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const u of usersData?.users ?? []) {
      if (u.identify?.microsoftUserId) {
        map.set(u.id, u.identify.microsoftUserId)
      }
    }
    return map
  }, [usersData])

  const allMsIds = useMemo(
    () => [...msIdMap.values()],
    [msIdMap],
  )
  const { msGraphUsers } = useMsGraphUsers(allMsIds)

  // サーバー値 + 編集差分パターン
  const serverName = team?.name ?? ''
  const serverGroupId = team?.group?.id ?? ''

  const [editName, setEditName] = useState<string | null>(null)
  const [editGroupId, setEditGroupId] = useState<string | null>(null)

  const name = editName ?? serverName
  const groupId = editGroupId ?? serverGroupId
  const setName = (v: string) => setEditName(v)
  const setGroupId = (v: string) => setEditGroupId(v)

  const dirty = editName !== null || editGroupId !== null
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const groups = groupsData?.groups ?? []

  const members: TeamMember[] = (team?.users ?? []).map(u => {
    const msId = msIdMap.get(u.id)
    const msUser = msId ? msGraphUsers.get(msId) : undefined
    return {
      id: u.id,
      name: msUser?.displayName ?? u.name ?? '',
    }
  })

  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [updateTeam] = useUpdateAdminTeamMutation()
  const [deleteTeam] = useDeleteAdminTeamMutation()
  const [updateTeamUsers] = useUpdateAdminTeamUsersMutation()

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true)
  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false)

  const handleAddMembers = async (selectedIds: string[]) => {
    try {
      await updateTeamUsers({
        variables: {
          id: teamId,
          input: { addUserIds: selectedIds },
        },
        refetchQueries: ['GetAdminTeam'],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
    setDialogOpen(false)
  }

  const handleDeleteMember = async (_index: number) => {
    const userId = team?.users[_index]?.id
    if (!userId) return
    try {
      await updateTeamUsers({
        variables: {
          id: teamId,
          input: { removeUserIds: [userId] },
        },
        refetchQueries: ['GetAdminTeam'],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  const handleSave = async () => {
    if (!name.trim()) return
    try {
      await updateTeam({
        variables: {
          id: teamId,
          input: { name: name.slice(0, 64), groupId },
        },
        refetchQueries: ['GetAdminTeams', 'GetAdminTeam'],
      })
      setEditName(null)
      setEditGroupId(null)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
      throw e
    }
  }

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam({
        variables: { id: teamId },
        refetchQueries: ['GetAdminTeams'],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
      throw e
    }
  }

  // 追加可能なユーザー（現チームメンバー以外）
  const currentMemberIds = new Set((team?.users ?? []).map(u => u.id))
  const selectableUsers: SelectableUser[] = (usersData?.users ?? [])
    .filter(u => !currentMemberIds.has(u.id))
    .map(u => {
      const msId = u.identify?.microsoftUserId
      const msUser = msId ? msGraphUsers.get(msId) : undefined
      return {
        id: u.id,
        userName: msUser?.displayName ?? u.name ?? '',
      }
    })

  return {
    name,
    setName,
    groupId,
    setGroupId,
    groups,
    members,
    dialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleAddMembers,
    handleDeleteMember,
    handleSave,
    handleDeleteTeam,
    deleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    dirty,
    teamName: team?.name ?? '',
    selectableUsers,
    loading,
    error: error ?? null,
    mutationError,
  }
}
