import { useState, useEffect, useRef } from 'react'
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
  const initialName = useRef('')

  useEffect(() => {
    if (location?.name !== undefined) {
      setName(location.name)
      initialName.current = location.name
    }
  }, [location?.name])

  const dirty = name !== initialName.current

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

  return { location, name, setName, dirty, handleSave, handleDelete, loading, error: error ?? null }
}
