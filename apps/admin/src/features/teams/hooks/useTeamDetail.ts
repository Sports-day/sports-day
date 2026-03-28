import { useState } from 'react'
import { MOCK_TEAMS, MOCK_TEAM_MEMBERS, MOCK_SELECTABLE_USERS } from '../mock'
import type { TeamMember } from '../types'

export function useTeamDetail(teamId: string) {
  const team = MOCK_TEAMS.find((t) => t.id === teamId)
  const [name, setName] = useState(team?.name ?? '')
  const [teamClass, setTeamClass] = useState(team?.class ?? '')
  const [members, setMembers] = useState<TeamMember[]>(
    MOCK_TEAM_MEMBERS[teamId] ?? []
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true)
  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false)

  const handleAddMembers = (selectedIds: string[]) => {
    const newMembers: TeamMember[] = selectedIds.flatMap((id) => {
      const user = MOCK_SELECTABLE_USERS.find((u) => u.id === id)
      if (!user) return []
      return [{
        studentId: user.studentId,
        name: user.userName,
        gender: user.gender,
      }]
    })
    setMembers((prev) => [...prev, ...newMembers])
    setDialogOpen(false)
  }

  const handleDeleteMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const t = MOCK_TEAMS.find((t) => t.id === teamId)
    if (t) {
      t.name = name
      t.class = teamClass
    }
    MOCK_TEAM_MEMBERS[teamId] = members
  }

  const handleDeleteTeam = () => {
    const index = MOCK_TEAMS.findIndex((t) => t.id === teamId)
    if (index !== -1) MOCK_TEAMS.splice(index, 1)
  }

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
    loading: false,
    error: null,
  }
}
