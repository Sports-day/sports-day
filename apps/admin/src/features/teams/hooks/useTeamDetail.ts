import { useState, useEffect, useRef } from 'react'
import {
  useGetAdminTeamQuery,
  useGetAdminUsersQuery,
  useUpdateAdminTeamMutation,
  useDeleteAdminTeamMutation,
  useUpdateAdminTeamUsersMutation,
  useGetAdminGroupsQuery,
} from '@/gql/__generated__/graphql'
import type { TeamMember, SelectableUser } from '../types'

export function useTeamDetail(teamId: string) {
  const { data, loading, error } = useGetAdminTeamQuery({
    variables: { id: teamId },
    skip: !teamId,
  })
  const { data: usersData } = useGetAdminUsersQuery()
  const { data: groupsData } = useGetAdminGroupsQuery()

  const team = data?.team
  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState('')
  const initialState = useRef({ name: '', groupId: '' })

  useEffect(() => {
    if (team) {
      const n = team.name ?? ''
      const g = team.group?.id ?? ''
      setName(n)
      setGroupId(g)
      initialState.current = { name: n, groupId: g }
    }
  }, [team])

  const dirty = name !== initialState.current.name || groupId !== initialState.current.groupId
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const groups = groupsData?.groups ?? []

  const members: TeamMember[] = (team?.users ?? []).map(u => ({
    id: u.id,
    name: u.name,
    gender: u.gender ?? '',
  }))

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
    }
  }

  const handleSave = async () => {
    try {
      await updateTeam({
        variables: {
          id: teamId,
          input: { name, groupId },
        },
        refetchQueries: ['GetAdminTeams', 'GetAdminTeam'],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
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
    }
  }

  // 追加可能なユーザー（現チームメンバー以外）
  const currentMemberIds = new Set((team?.users ?? []).map(u => u.id))
  const selectableUsers: SelectableUser[] = (usersData?.users ?? [])
    .filter(u => !currentMemberIds.has(u.id))
    .map(u => ({
      id: u.id,
      userName: u.name,
      gender: u.gender ?? '',
    }))

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
