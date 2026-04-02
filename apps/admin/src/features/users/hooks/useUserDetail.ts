import { useState } from 'react'
import { useGetAdminUserQuery } from '@/gql/__generated__/graphql'

const GENDER_OPTIONS = ['男性', '女性']
const CLASS_OPTIONS = ['Class A', 'Class B', 'Class C']
const ROLE_OPTIONS = ['管理者', '一般', 'ゲスト']

export function useUserDetail(userId: string) {
  const { data, loading, error } = useGetAdminUserQuery({
    variables: { id: userId },
    skip: !userId,
  })
  const user = data?.user

  // 【未確定】 gender, class, role は GraphQL User に存在しないためローカル状態で管理
  const [gender, setGender] = useState('')
  const [userClass, setUserClass] = useState(user?.groups[0]?.name ?? '')
  const [role, setRole] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleSave = () => {
    // 【未確定】 GraphQL に gender/class/role 更新 mutation が必要
  }

  const handleDeleteUser = () => {
    // 【未確定】 deleteUser mutation が GraphQL スキーマに存在しないため未実装
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
