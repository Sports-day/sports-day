import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useCreateAdminTeamMutation,
  useGetAdminGroupsQuery,
  GetAdminTeamsDocument,
} from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

type TeamCreateForm = {
  name: string
  groupId: string
}

export function useTeamCreate(onSuccess: (id: string) => void) {
  const [form, setForm] = useState<TeamCreateForm>({
    name: '',
    groupId: '',
  })

  const [createTeam] = useCreateAdminTeamMutation()
  const { data: groupsData } = useGetAdminGroupsQuery()
  const groups = (groupsData?.groups ?? []).map(g => ({ id: g.id, name: g.name }))

  const handleChange = (field: keyof TeamCreateForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const setGroupId = (id: string) => {
    setForm(prev => ({ ...prev, groupId: id }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.groupId) return
    try {
      const result = await createTeam({
        variables: {
          input: {
            name: form.name.slice(0, 64),
            groupId: form.groupId,
            userIds: [],
          },
        },
        refetchQueries: [{ query: GetAdminTeamsDocument }],
      })
      const created = result.data?.createTeam
      if (!created) return
      onSuccess(created.id)
    } catch (e) {
      showApiErrorToast(e)
    }
  }

  return { form, handleChange, handleSubmit, groups, groupId: form.groupId, setGroupId }
}
