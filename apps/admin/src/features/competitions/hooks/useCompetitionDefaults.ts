import { useState, useEffect, useCallback, useRef } from 'react'
import {
  useGetAdminCompetitionQuery,
  useGetAdminLocationsForMatchesQuery,
  useApplyAdminCompetitionDefaultsMutation,
  GetAdminCompetitionDocument,
} from '@/gql/__generated__/graphql'
import { showToast, showErrorToast } from '@/lib/toast'

type DefaultsForm = {
  startTime: string
  matchDuration: number
  breakDuration: number
  locationId: string
}

export function useCompetitionDefaults(competitionId: string) {
  const { data: compData } = useGetAdminCompetitionQuery({
    variables: { id: competitionId },
    skip: !competitionId,
  })

  const { data: locData } = useGetAdminLocationsForMatchesQuery()

  const locations = (locData?.locations ?? []).map(l => ({
    id: l.id,
    name: l.name,
  }))

  const [form, setForm] = useState<DefaultsForm>({
    startTime: '',
    matchDuration: 15,
    breakDuration: 5,
    locationId: '',
  })

  // サーバーの値を保持（dirty判定用）
  const serverForm = useRef<DefaultsForm>(form)

  // サーバーデータでフォームを初期化
  useEffect(() => {
    if (!compData?.competition) return
    const c = compData.competition
    const initial: DefaultsForm = {
      startTime: c.startTime
        ? toDatetimeLocal(c.startTime)
        : '',
      matchDuration: c.matchDuration ?? 15,
      breakDuration: c.breakDuration ?? 5,
      locationId: c.defaultLocation?.id ?? '',
    }
    setForm(initial)
    serverForm.current = initial
  }, [compData])

  const [applyMutation, { loading }] = useApplyAdminCompetitionDefaultsMutation()

  const handleApply = useCallback(async () => {
    if (!form.startTime) return
    try {
      await applyMutation({
        variables: {
          id: competitionId,
          input: {
            startTime: new Date(form.startTime).toISOString(),
            matchDuration: form.matchDuration,
            breakDuration: form.breakDuration,
            locationId: form.locationId || undefined,
          },
        },
        refetchQueries: [
          { query: GetAdminCompetitionDocument, variables: { id: competitionId } },
        ],
      })
      showToast('デフォルト設定を適用しました')
    } catch (e) {
      console.error('applyCompetitionDefaults failed:', e)
      showErrorToast('デフォルト設定の適用に失敗しました')
    }
  }, [form, competitionId, applyMutation])

  const isValid = form.startTime !== '' && form.matchDuration > 0 && form.breakDuration >= 0
  const dirty = form.startTime !== serverForm.current.startTime
    || form.matchDuration !== serverForm.current.matchDuration
    || form.breakDuration !== serverForm.current.breakDuration
    || form.locationId !== serverForm.current.locationId

  return {
    form,
    setForm,
    locations,
    loading,
    isValid,
    dirty,
    handleApply,
  }
}

function toDatetimeLocal(isoString: string): string {
  const d = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
