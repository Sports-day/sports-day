import { useState, useEffect } from 'react'
import {
  useGetAdminLocationQuery,
  useUpdateAdminLocationMutation,
  useDeleteAdminLocationMutation,
  GetAdminLocationsDocument,
} from '@/gql/__generated__/graphql'

export function useLocationDetail(locationId: string, onSave: () => void, onDelete: () => void) {
  const { data, loading, error } = useGetAdminLocationQuery({ variables: { id: locationId } })
  const location = data?.location

  const [name, setName] = useState('')
  const [note, setNote] = useState('') // 【未確定】GraphQL Location に description はない

  useEffect(() => {
    if (location?.name !== undefined) setName(location.name)
  }, [location?.name])

  const [updateLocation] = useUpdateAdminLocationMutation({
    refetchQueries: [{ query: GetAdminLocationsDocument }],
  })
  const [deleteLocation] = useDeleteAdminLocationMutation({
    refetchQueries: [{ query: GetAdminLocationsDocument }],
  })

  const handleSave = async () => {
    await updateLocation({ variables: { id: locationId, input: { name } } })
    onSave()
  }

  const handleDelete = async () => {
    await deleteLocation({ variables: { id: locationId } })
    onDelete()
  }

  return { location, name, note, setName, setNote, handleSave, handleDelete, loading, error: error ?? null }
}
