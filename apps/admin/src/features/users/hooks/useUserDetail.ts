import { useState, useEffect, useRef } from 'react'
import {
  Role,
  useGetAdminUserQuery,
  useGetAdminGroupsQuery,
  useUpdateAdminUserRoleMutation,
  useDeleteAdminUserMutation,
  useGetAdminUserSportExperiencesQuery,
  useAddAdminSportExperiencesMutation,
  useDeleteAdminSportExperiencesMutation,
  useAddAdminGroupUsersForClassMutation,
  useRemoveAdminGroupUsersForClassMutation,
  GetAdminUsersDocument,
  GetAdminUserDocument,
  GetAdminUserSportExperiencesDocument,
} from '@/gql/__generated__/graphql'
import { useMsGraphUser } from '@/hooks/useMsGraphUsers'
import { showErrorToast } from '@/lib/toast'

const ROLE_SCENES = [
  { id: Role.Admin, name: '管理者' },
  { id: Role.Organizer, name: '運営者' },
  { id: Role.Participant, name: '参加者' },
]

export function useUserDetail(userId: string) {
  const { data, loading, error } = useGetAdminUserQuery({
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  })
  const { data: groupsData } = useGetAdminGroupsQuery({ fetchPolicy: 'cache-and-network' })
  const { data: expData } = useGetAdminUserSportExperiencesQuery({
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  })
  const user = data?.user

  const { msGraphUser, loading: msGraphLoading } = useMsGraphUser(
    user?.identify?.microsoftUserId,
  )

  const [groupId, setGroupId] = useState('')
  const [role, setRole] = useState('')
  const [experiencedSportIds, setExperiencedSportIds] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const initialState = useRef({ groupId: '', role: '', experiencedSportIds: [] as string[] })
  const experienceInitialized = useRef(false)

  useEffect(() => {
    if (user) {
      const gid = user.groups[0]?.id ?? ''
      setGroupId(gid)
      setRole(user.role)
      initialState.current = { groupId: gid, role: user.role, experiencedSportIds: initialState.current.experiencedSportIds }
    }
  }, [user])

  // 経験者スポーツの初期化
  useEffect(() => {
    if (experienceInitialized.current || !expData?.userSportExperiences) return
    const ids = expData.userSportExperiences.map((e) => e.sportId)
    setExperiencedSportIds(ids)
    initialState.current.experiencedSportIds = ids
    experienceInitialized.current = true
  }, [expData])

  const allSports = (expData?.sports ?? []).map((s) => ({ id: s.id, name: s.name }))
  const groups = groupsData?.groups ?? []

  const dirty =
    groupId !== initialState.current.groupId ||
    role !== initialState.current.role ||
    JSON.stringify([...experiencedSportIds].sort()) !== JSON.stringify([...initialState.current.experiencedSportIds].sort())

  const [updateUserRole] = useUpdateAdminUserRoleMutation({
    refetchQueries: [{ query: GetAdminUsersDocument }],
  })

  const [deleteUser] = useDeleteAdminUserMutation({
    refetchQueries: [{ query: GetAdminUsersDocument }],
  })

  const [addSportExperiences] = useAddAdminSportExperiencesMutation({
    refetchQueries: [{ query: GetAdminUserSportExperiencesDocument, variables: { userId } }],
  })
  const [deleteSportExperiences] = useDeleteAdminSportExperiencesMutation({
    refetchQueries: [{ query: GetAdminUserSportExperiencesDocument, variables: { userId } }],
  })

  const [addGroupUsers] = useAddAdminGroupUsersForClassMutation({
    refetchQueries: [{ query: GetAdminUserDocument, variables: { id: userId } }],
  })
  const [removeGroupUsers] = useRemoveAdminGroupUsersForClassMutation({
    refetchQueries: [{ query: GetAdminUserDocument, variables: { id: userId } }],
  })

  const handleSave = async () => {
    if (!userId) return
    try {
      if (user && role && role !== user.role) {
        await updateUserRole({
          variables: { userId, role: role as Role },
        })
      }

      // グループ(クラス)の差分保存
      const prevGroupId = initialState.current.groupId
      if (groupId !== prevGroupId) {
        if (prevGroupId) {
          await removeGroupUsers({
            variables: { id: prevGroupId, input: { userIds: [userId] } },
          })
        }
        if (groupId) {
          await addGroupUsers({
            variables: { id: groupId, input: { userIds: [userId] } },
          })
        }
        initialState.current.groupId = groupId
      }

      // 経験者スポーツの差分保存
      const prevSet = new Set(initialState.current.experiencedSportIds)
      const currSet = new Set(experiencedSportIds)
      const toAdd = experiencedSportIds.filter((id) => !prevSet.has(id))
      const toRemove = initialState.current.experiencedSportIds.filter((id) => !currSet.has(id))
      for (const sportId of toAdd) {
        await addSportExperiences({ variables: { sportId, userIds: [userId] } })
      }
      for (const sportId of toRemove) {
        await deleteSportExperiences({ variables: { sportId, userIds: [userId] } })
      }
      initialState.current.experiencedSportIds = [...experiencedSportIds]
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  const handleDeleteUser = async () => {
    if (!userId) return
    try {
      await deleteUser({ variables: { id: userId } })
      setDeleteDialogOpen(false)
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  return {
    userName: msGraphUser?.displayName ?? user?.name ?? '',
    userEmail: msGraphUser?.mail ?? user?.email ?? '',
    groupId,
    setGroupId,
    groups,
    role,
    setRole,
    dirty,
    handleSave,
    handleDeleteUser,
    deleteDialogOpen,
    openDeleteDialog: () => setDeleteDialogOpen(true),
    closeDeleteDialog: () => setDeleteDialogOpen(false),
    experiencedSportIds,
    setExperiencedSportIds,
    allSports,
    roleScenes: ROLE_SCENES,
    loading: loading || msGraphLoading,
    error: error ?? null,
  }
}
