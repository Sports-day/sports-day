import { useState, useMemo } from 'react'
import {
  useGetAdminTeamQuery,
  useGetAdminUsersQuery,
  useUpdateAdminTeamMutation,
  useDeleteAdminTeamMutation,
  useUpdateAdminTeamUsersMutation,
  useGetAdminGroupsQuery,
  useGetAdminSportScenesForTeamQuery,
  useAddTeamSportEntryMutation,
  useDeleteTeamSportEntryMutation,
  GetAdminTeamsDocument,
  GetAdminTeamDocument,
  GetAdminSportScenesForTeamDocument,
} from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'
import { showApiErrorToast } from '@/lib/toast'
import type { TeamMember, SelectableUser, SportGroup } from '../types'

export function useTeamDetail(teamId: string) {
  const { data, loading, error } = useGetAdminTeamQuery({
    variables: { id: teamId },
    skip: !teamId,
    fetchPolicy: 'cache-and-network',
  })
  const { data: usersData } = useGetAdminUsersQuery({ fetchPolicy: 'cache-and-network' })
  const { data: groupsData } = useGetAdminGroupsQuery({ fetchPolicy: 'cache-and-network' })
  const { data: sportScenesData, loading: sportScenesLoading } = useGetAdminSportScenesForTeamQuery({
    fetchPolicy: 'network-only',
  })

  const team = data?.team

  const msIdMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const u of usersData?.users ?? []) {
      if (u.identify?.microsoftUserId) {
        map.set(u.id, u.identify.microsoftUserId)
      }
    }
    return map
  }, [usersData])

  const allMsIds = useMemo(() => [...msIdMap.values()], [msIdMap])
  const { msGraphUsers } = useMsGraphUsers(allMsIds)

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
  const [addSportEntry] = useAddTeamSportEntryMutation()
  const [deleteSportEntry] = useDeleteTeamSportEntryMutation()

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
        refetchQueries: [{ query: GetAdminTeamDocument, variables: { id: teamId } }],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
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
        refetchQueries: [{ query: GetAdminTeamDocument, variables: { id: teamId } }],
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
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
        refetchQueries: [
          { query: GetAdminTeamsDocument },
          { query: GetAdminTeamDocument, variables: { id: teamId } },
        ],
      })
      setEditName(null)
      setEditGroupId(null)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
      throw e
    }
  }

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam({
        variables: { id: teamId },
        update(cache) {
          cache.evict({ id: cache.identify({ __typename: 'Team', id: teamId }) })
          cache.gc()
        },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
      throw e
    }
  }

  const handleToggleSportEntry = async (sportSceneId: string, entryId: string | null) => {
    try {
      if (entryId) {
        await deleteSportEntry({
          variables: { entryId },
          refetchQueries: [{ query: GetAdminSportScenesForTeamDocument }],
        })
      } else {
        await addSportEntry({
          variables: { sportSceneId, teamId },
          refetchQueries: [{ query: GetAdminSportScenesForTeamDocument }],
        })
      }
    } catch (e) {
      showApiErrorToast(e)
    }
  }

  // グループに所属するユーザーIDセット（メンバー追加フィルタ用）
  const groupUserIds = useMemo(
    () => new Set((team?.group?.users ?? []).map(u => u.id)),
    [team],
  )

  const currentMemberIds = new Set((team?.users ?? []).map(u => u.id))

  // チームのクラスに所属し、かつまだメンバーでないユーザーのみ表示
  const selectableUsers: SelectableUser[] = useMemo(() => {
    const allUsers = usersData?.users ?? []
    const shouldFilterByGroup = groupUserIds.size > 0
    return allUsers
      .filter(u => !currentMemberIds.has(u.id) && (!shouldFilterByGroup || groupUserIds.has(u.id)))
      .map(u => {
        const msId = u.identify?.microsoftUserId
        const msUser = msId ? msGraphUsers.get(msId) : undefined
        return {
          id: u.id,
          userName: msUser?.displayName ?? u.name ?? '',
          email: msUser?.mail ?? u.email ?? '',
        }
      })
  // currentMemberIdsはrender毎に変わるのでteam?.usersで依存
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersData, team?.users, team?.group?.users, groupUserIds, msGraphUsers])

  // スポーツエントリーグループ（スポーツ別・シーン別にまとめたもの）
  const sportGroups: SportGroup[] = useMemo(() => {
    const sports = sportScenesData?.sports ?? []
    return sports
      .map(sport => {
        const scenes = (sport.scene ?? []).map(ss => {
          const entry = ss.entries.find(e => e.team.id === teamId)
          return {
            sportSceneId: ss.id,
            sceneId: ss.scene.id,
            sceneName: ss.scene.name,
            entryId: entry?.id ?? null,
            isRegistered: !!entry,
          }
        })
        return { sportId: sport.id, sportName: sport.name, scenes }
      })
      .filter(sg => sg.scenes.length > 0)
  }, [sportScenesData, teamId])

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
    sportGroups,
    sportScenesLoading,
    handleToggleSportEntry,
    loading,
    error: error ?? null,
    mutationError,
  }
}
