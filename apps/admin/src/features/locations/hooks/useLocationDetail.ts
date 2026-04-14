import { useState } from 'react'
import {
  useGetAdminLocationQuery,
  useUpdateAdminLocationMutation,
  useDeleteAdminLocationMutation,
  GetAdminLocationsDocument,
} from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

export function useLocationDetail(locationId: string, onSave: () => void, onDelete: () => void) {
  const { data, loading, error } = useGetAdminLocationQuery({ variables: { id: locationId }, fetchPolicy: 'cache-and-network' })
  const location = data?.location

  // サーバー値 + 編集差分パターン
  const serverName = location?.name ?? ''
  const [editName, setEditName] = useState<string | null>(null)
  const name = editName ?? serverName
  const setName = (v: string) => setEditName(v)
  const dirty = editName !== null

  const [updateLocation] = useUpdateAdminLocationMutation({
    refetchQueries: [{ query: GetAdminLocationsDocument }],
  })
  const [deleteLocation] = useDeleteAdminLocationMutation({
    refetchQueries: [{ query: GetAdminLocationsDocument }],
  })

  const handleSave = async () => {
    if (!name.trim()) return
    try {
      await updateLocation({ variables: { id: locationId, input: { name: name.slice(0, 64) } } })
      setEditName(null)
      onSave()
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  const handleDelete = async () => {
    try {
      await deleteLocation({ variables: { id: locationId } })
      onDelete()
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  return { location, name, setName, dirty, handleSave, handleDelete, loading, error: error ?? null }
}
