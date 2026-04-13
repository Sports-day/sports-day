import { useMemo } from 'react'
import { useGetAdminCompetitionMatchesQuery } from '@/gql/__generated__/graphql'

export type QrPdfLocation = {
  id: string
  name: string
}

export type QrPdfData = {
  competitionName: string
  panelUrl: string
  locations: QrPdfLocation[]
  loading: boolean
}

export function useQrPdfData(competitionId: string, competitionName: string, skip: boolean): QrPdfData {
  const { data, loading } = useGetAdminCompetitionMatchesQuery({
    variables: { competitionId },
    skip,
  })

  const panelUrl = (import.meta.env.VITE_PANEL_URL as string ?? '').replace(/\/$/, '')

  const locations = useMemo(() => {
    const matches = data?.competition?.matches ?? []
    const locationMap = new Map<string, string>()
    for (const m of matches) {
      if (m.location?.id && m.location?.name) {
        locationMap.set(m.location.id, m.location.name)
      }
    }
    return Array.from(locationMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  }, [data])

  return {
    competitionName,
    panelUrl,
    locations,
    loading,
  }
}
