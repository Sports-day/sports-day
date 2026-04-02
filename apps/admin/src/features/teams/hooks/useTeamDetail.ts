import { useState } from 'react'
import {
  useGetAdminTeamQuery,
  useGetAdminAllUsersForTeamsQuery,
  useUpdateAdminTeamMutation,
  useDeleteAdminTeamMutation,
  useUpdateAdminTeamUsersMutation,
} from '@/gql/__generated__/graphql'
import type { TeamMember, SelectableUser } from '../types'

export function useTeamDetail(teamId: string) {
  const { data, loading, error } = useGetAdminTeamQuery({
    variables: { id: teamId },
    skip: !teamId,
  })
  const { data: usersData } = useGetAdminAllUsersForTeamsQuery()

  const team = data?.team
  const [name, setName] = useState(team?.name ?? '')
  const [teamClass, setTeamClass] = useState(team?.group.name ?? '')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // チームメンバーは GraphQL User として管理
  const members: TeamMember[] = (team?.users ?? []).map(u => ({
    studentId: u.id,
    name: u.name,
    gender: '男性' as const,  // 【未確定】 GraphQL User に gender フィールドなし
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
        input: { name },
        // 【未確定】 groupId は group名からの逆引きが必要
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
      gender: '男性' as const,  // 【未確定】 GraphQL User に gender フィールドなし
      studentId: u.id,
    }))

  return {
    name,
    setName,
    teamClass,
    setTeamClass,
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
