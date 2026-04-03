import { useState } from 'react'
import {
  useGetAdminUserQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  GetAdminUsersDocument,
} from '@/gql/__generated__/graphql'

const GENDER_OPTIONS = ['男性', '女性']
const CLASS_OPTIONS = ['Class A', 'Class B', 'Class C']
const ROLE_OPTIONS = ['管理者', '一般', 'ゲスト']

export function useUserDetail(userId: string) {
  const { data, loading, error } = useGetAdminUserQuery({
    variables: { id: userId },
    skip: !userId,
  })
  const user = data?.user

  const [gender, setGender] = useState(user?.gender ?? '')
  const [userClass, setUserClass] = useState(user?.groups[0]?.name ?? '')
  const [role, setRole] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [updateUser] = useUpdateAdminUserMutation({
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
    userClass,
    setUserClass,
    role,
    setRole,
    handleSave,
    handleDeleteUser,
    deleteDialogOpen,
    openDeleteDialog: () => setDeleteDialogOpen(true),
    closeDeleteDialog: () => setDeleteDialogOpen(false),
    genderOptions: GENDER_OPTIONS,
    classOptions: CLASS_OPTIONS,
    roleOptions: ROLE_OPTIONS,
    loading,
    error: error ?? null,
  }
}
