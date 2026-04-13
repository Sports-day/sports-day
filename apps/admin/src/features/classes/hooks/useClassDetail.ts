import { useState, useMemo } from 'react'
import {
  useGetAdminGroupForClassQuery,
  useGetAdminUsersQuery,
  useUpdateAdminGroupForClassMutation,
  useDeleteAdminGroupForClassMutation,
  useAddAdminGroupUsersForClassMutation,
  useRemoveAdminGroupUsersForClassMutation,
  GetAdminGroupsForClassesDocument,
} from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'
import { showErrorToast } from '@/lib/toast'
import type { ClassMember } from '../types'

export function useClassDetail(classId: string) {
  const { data, loading, error } = useGetAdminGroupForClassQuery({
    variables: { id: classId },
    skip: !classId,
  })
  const { data: usersData } = useGetAdminUsersQuery()

  const group = data?.group

  // ユーザーID → microsoftUserId のマップを作成
  const msIdMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const u of usersData?.users ?? []) {
      if (u.identify?.microsoftUserId) {
        map.set(u.id, u.identify.microsoftUserId)
      }
    }
    return map
  }, [usersData])

  const allMsIds = useMemo(
    () => [...msIdMap.values()],
    [msIdMap],
  )
  const { msGraphUsers } = useMsGraphUsers(allMsIds)

  // サーバー値 + 編集差分パターン
  const serverName = group?.name ?? ''
  const [editName, setEditName] = useState<string | null>(null)
  const name = editName ?? serverName
  const setName = (v: string) => setEditName(v)
  const dirty = editName !== null

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const members: ClassMember[] = (group?.users ?? []).map(u => {
    const msId = msIdMap.get(u.id)
    const msUser = msId ? msGraphUsers.get(msId) : undefined
    return {
      id: u.id,
      name: msUser?.displayName ?? u.name ?? '',
      email: msUser?.mail ?? u.email ?? '',
    }
  })

  const [updateGroup] = useUpdateAdminGroupForClassMutation({
    refetchQueries: [{ query: GetAdminGroupsForClassesDocument }],
  })
  const [deleteGroup] = useDeleteAdminGroupForClassMutation({
    refetchQueries: [{ query: GetAdminGroupsForClassesDocument }],
  })
  const [addGroupUsers] = useAddAdminGroupUsersForClassMutation()
  const [removeGroupUsers] = useRemoveAdminGroupUsersForClassMutation()

  const handleSave = async () => {
    if (!name.trim()) return
    try {
      await updateGroup({ variables: { id: classId, input: { name: name.slice(0, 64) } } })
      setEditName(null)
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  const handleDelete = async () => {
    try {
      await deleteGroup({ variables: { id: classId } })
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  const handleAddMembers = async (selectedIds: string[]) => {
    try {
      await addGroupUsers({
        variables: {
          id: classId,
          input: { userIds: selectedIds },
        },
        refetchQueries: ['GetAdminGroupForClass'],
      })
      setDialogOpen(false)
    } catch {
      showErrorToast()
    }
  }

  const handleDeleteMember = async (index: number) => {
    const userId = group?.users[index]?.id
    if (!userId) return
    try {
      await removeGroupUsers({
        variables: {
          id: classId,
          input: { userIds: [userId] },
        },
        refetchQueries: ['GetAdminGroupForClass'],
      })
    } catch {
      showErrorToast()
    }
  }

  // 追加可能なユーザー（現メンバー以外）
  const currentMemberIds = new Set((group?.users ?? []).map(u => u.id))
  const selectableUsers = (usersData?.users ?? [])
    .filter(u => !currentMemberIds.has(u.id))
    .map(u => {
      const msId = u.identify?.microsoftUserId
      const msUser = msId ? msGraphUsers.get(msId) : undefined
      return {
        id: u.id,
        userName: msUser?.displayName ?? u.name ?? '',
        email: msUser?.mail ?? u.email ?? '',
      }
    })

  return {
    name,
    setName,
    dirty,
    members,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleSave,
    handleDelete,
    handleAddMembers,
    handleDeleteMember,
    selectableUsers,
    className: group?.name ?? '',
    loading,
    error: error ?? null,
  }
}
