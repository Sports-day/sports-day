import { useState, useEffect } from 'react'
import {
  useGetAdminTeamQuery,
  useGetAdminAllUsersForTeamsQuery,
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
  const { data: usersData } = useGetAdminAllUsersForTeamsQuery()
  const { data: groupsData } = useGetAdminGroupsQuery()

  const team = data?.team
  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState('')

  useEffect(() => {
    if (team) {
      setName(team.name ?? '')
      setGroupId(team.group?.id ?? '')
    }
  }, [team])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const groups = groupsData?.groups ?? []

  // チームメンバーは GraphQL User として管理
  const members: TeamMember[] = (team?.users ?? []).map(u => ({
    studentId: u.id,
    name: u.name,
    gender: u.gender ?? '',
  }))

  const [updateTeam] = useUpdateAdminTeamMutation()
  const [deleteTeam] = useDeleteAdminTeamMutation()
  const [updateTeamUsers] = useUpdateAdminTeamUsersMutation()

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true)
  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false)

  const handleAddMembers = (selectedIds: string[]) => {
    updateTeamUsers({
      variables: {
        id: teamId,
        input: { addUserIds: selectedIds },
      },
      refetchQueries: ['GetAdminTeam'],
    }).catch(() => {})
    setDialogOpen(false)
  }

  const handleDeleteMember = (_index: number) => {
    const userId = team?.users[_index]?.id
    if (!userId) return
    updateTeamUsers({
      variables: {
        id: teamId,
        input: { removeUserIds: [userId] },
      },
      refetchQueries: ['GetAdminTeam'],
    }).catch(() => {})
  }

  const handleSave = () => {
    updateTeam({
      variables: {
        id: teamId,
        input: { name, groupId },
      },
      refetchQueries: ['GetAdminTeams', 'GetAdminTeam'],
    }).catch(() => {})
  }

  const handleDeleteTeam = () => {
    deleteTeam({
      variables: { id: teamId },
      refetchQueries: ['GetAdminTeams'],
    }).catch(() => {})
  }

  // 追加可能なユーザー（現チームメンバー以外）
  const currentMemberIds = new Set((team?.users ?? []).map(u => u.id))
  const selectableUsers: SelectableUser[] = (usersData?.users ?? [])
    .filter(u => !currentMemberIds.has(u.id))
    .map(u => ({
      id: u.id,
      userName: u.name,
      gender: u.gender ?? '',
      studentId: u.id,
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
    teamName: team?.name ?? '',
    selectableUsers,
    loading,
    error: error ?? null,
  }
}
