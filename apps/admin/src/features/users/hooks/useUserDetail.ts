import { useState } from 'react'
import { MOCK_USERS, persistUsers } from '../mock'
import { notifyUserListeners } from './useUsers'

const GENDER_OPTIONS = ['男性', '女性']
const CLASS_OPTIONS = ['Class A', 'Class B', 'Class C']
const ROLE_OPTIONS = ['管理者', '一般', 'ゲスト']

export function useUserDetail(userId: string) {
  const user = MOCK_USERS.find((u) => u.id === userId)
  const [gender, setGender] = useState(user?.gender ?? '')
  const [userClass, setUserClass] = useState(user?.class ?? '')
  const [role, setRole] = useState(user?.role ?? '')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleSave = () => {
    const u = MOCK_USERS.find((u) => u.id === userId)
    if (u) {
      u.gender = gender as '男性' | '女性'
      u.class = userClass
      u.role = role
    }
    persistUsers()
    notifyUserListeners()
  }

  const handleDeleteUser = () => {
    const index = MOCK_USERS.findIndex((u) => u.id === userId)
    if (index !== -1) MOCK_USERS.splice(index, 1)
    persistUsers()
    notifyUserListeners()
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
    loading: false,
    error: null,
  }
}
