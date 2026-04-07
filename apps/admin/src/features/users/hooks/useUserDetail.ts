import { useState, useEffect, useRef } from 'react'
import {
  Role,
  useGetAdminUserQuery,
  useGetAdminGroupsQuery,
  useUpdateAdminUserMutation,
  useUpdateAdminUserRoleMutation,
  useDeleteAdminUserMutation,
  GetAdminUsersDocument,
} from '@/gql/__generated__/graphql'

const GENDER_SCENES = [
  { id: '男', name: '男' },
  { id: '女', name: '女' },
]
const ROLE_SCENES = [
  { id: Role.Admin, name: '管理者' },
  { id: Role.Organizer, name: '運営者' },
  { id: Role.Participant, name: '参加者' },
]

export function useUserDetail(userId: string) {
  const { data, loading, error } = useGetAdminUserQuery({
    variables: { id: userId },
    skip: !userId,
  })
  const { data: groupsData } = useGetAdminGroupsQuery()
  const user = data?.user

  const [gender, setGender] = useState('')
  const [groupId, setGroupId] = useState('')
  const [role, setRole] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const initialState = useRef({ gender: '', groupId: '', role: '' })

  useEffect(() => {
    if (user) {
      const g = user.gender ?? ''
      const gid = user.groups[0]?.id ?? ''
      setGender(g)
      setGroupId(gid)
      setRole(user.role)
      initialState.current = { gender: g, groupId: gid, role: user.role }
    }
  }, [user])

  const groups = groupsData?.groups ?? []

  const dirty =
    gender !== initialState.current.gender ||
    groupId !== initialState.current.groupId ||
    role !== initialState.current.role

  const [updateUser] = useUpdateAdminUserMutation({
    refetchQueries: [{ query: GetAdminUsersDocument }],
  })

  const [updateUserRole] = useUpdateAdminUserRoleMutation({
    refetchQueries: [{ query: GetAdminUsersDocument }],
  })

  const [deleteUser] = useDeleteAdminUserMutation({
    refetchQueries: [{ query: GetAdminUsersDocument }],
  })

  const handleSave = async () => {
    if (!userId) return
    await updateUser({
      variables: {
        id: userId,
        input: {
          name: user?.name,
          email: user?.email,
          gender: gender || undefined,
        },
      },
    })
    if (user && role && role !== user.role) {
      await updateUserRole({
        variables: { userId, role: role as Role },
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!userId) return
    await deleteUser({ variables: { id: userId } })
    setDeleteDialogOpen(false)
  }

  return {
    userName: user?.name ?? '',
    gender,
    setGender,
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
    genderScenes: GENDER_SCENES,
    roleScenes: ROLE_SCENES,
    loading,
    error: error ?? null,
  }
}
