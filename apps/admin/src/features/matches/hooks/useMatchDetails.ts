import { useState, useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@apollo/client'
import type { ActiveMatch } from '../types'
import {
  useUpdateAdminMatchDetailMutation,
  useUpdateAdminJudgmentMutation,
  useGetAdminLocationsForMatchesQuery,
  useGetAdminMatchQuery,
} from '@/gql/__generated__/graphql'
import { GET_ADMIN_COMPETITION_JUDGE_OPTIONS } from '../api'
import { showErrorToast } from '@/lib/toast'

export type JudgeType = 'group' | 'team' | 'user'

export type JudgeOption = { id: string; name: string }

type CompetitionJudgeData = {
  competition: {
    id: string
    teams: Array<{
      id: string
      name: string
      group: { id: string; name: string }
      users: Array<{ id: string; name: string }>
    }>
  }
}

export function useMatchDetails(match: ActiveMatch, competitionId?: string) {
  const [locationId, setLocationId] = useState(match.locationId ?? '')
  const [time, setTime] = useState(match.time ?? new Date().toISOString().slice(0, 16))
  const [judgmentType, setJudgmentType] = useState<JudgeType | null>(null)
  const [judgmentTargetId, setJudgmentTargetId] = useState('')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const hasInitialized = useRef(false)

  const [updateMatchDetail] = useUpdateAdminMatchDetailMutation()
  const [updateJudgment] = useUpdateAdminJudgmentMutation()
  const { data: locationsData } = useGetAdminLocationsForMatchesQuery()
  const locations = locationsData?.locations ?? []

  // 現在の試合の審判詳細を取得（user/team/group の ID まで含む）
  const { data: matchData } = useGetAdminMatchQuery({
    variables: { id: match.id },
    fetchPolicy: 'cache-and-network',
  })

  // match が変わったら初期化フラグをリセット
  useEffect(() => {
    hasInitialized.current = false
    setJudgmentType(null)
    setJudgmentTargetId('')
  }, [match.id])

  // matchData ロード時に審判の初期値を設定（1回だけ）
  useEffect(() => {
    if (hasInitialized.current) return
    const j = matchData?.match?.judgment
    if (!j) return
    hasInitialized.current = true
    if (j.group?.id) {
      setJudgmentType('group')
      setJudgmentTargetId(j.group.id)
    } else if (j.team?.id) {
      setJudgmentType('team')
      setJudgmentTargetId(j.team.id)
    } else if (j.user?.id) {
      setJudgmentType('user')
      setJudgmentTargetId(j.user.id)
    }
  }, [matchData])

  // 大会エントリーから審判候補を取得
  const { data: compData } = useQuery<CompetitionJudgeData>(
    GET_ADMIN_COMPETITION_JUDGE_OPTIONS,
    {
      variables: { competitionId: competitionId ?? '' },
      skip: !competitionId,
    },
  )

  const judgeOptions = useMemo(() => {
    const teams = compData?.competition?.teams ?? []
    const groupMap = new Map<string, JudgeOption>()
    const userMap = new Map<string, JudgeOption>()

    for (const team of teams) {
      if (team.group) groupMap.set(team.group.id, { id: team.group.id, name: team.group.name })
      for (const user of team.users ?? []) {
        userMap.set(user.id, { id: user.id, name: user.name })
      }
    }

    return {
      groups: Array.from(groupMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      teams: teams.map(t => ({ id: t.id, name: t.name })).sort((a, b) => a.name.localeCompare(b.name)),
      users: Array.from(userMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    }
  }, [compData])

  const optionsByType: Record<JudgeType, JudgeOption[]> = {
    group: judgeOptions.groups,
    team: judgeOptions.teams,
    user: judgeOptions.users,
  }

  // 現在設定されている審判の表示名（MatchEditPage の情報タグ用）
  const currentJudgmentLabel = useMemo(() => {
    const j = matchData?.match?.judgment
    if (!j) return undefined
    return j.user?.name ?? j.team?.name ?? j.group?.name ?? j.name ?? undefined
  }, [matchData])

  const handleSave = async () => {
    if (!time) return
    try {
      await updateMatchDetail({
        variables: {
          id: match.id,
          input: { time, locationId: locationId || undefined },
        },
        refetchQueries: ['GetAdminCompetitionMatches', 'GetAdminMatches'],
      })

      // 審判に変更がある場合のみ更新
      if (judgmentType && judgmentTargetId) {
        const currentJ = matchData?.match?.judgment
        const unchanged =
          (judgmentType === 'group' && currentJ?.group?.id === judgmentTargetId) ||
          (judgmentType === 'team' && currentJ?.team?.id === judgmentTargetId) ||
          (judgmentType === 'user' && currentJ?.user?.id === judgmentTargetId)

        if (!unchanged) {
          await updateJudgment({
            variables: {
              id: match.id,
              input: {
                entry: {
                  groupId: judgmentType === 'group' ? judgmentTargetId : undefined,
                  teamId: judgmentType === 'team' ? judgmentTargetId : undefined,
                  userId: judgmentType === 'user' ? judgmentTargetId : undefined,
                },
              },
            },
            refetchQueries: ['GetAdminMatch'],
          })
          hasInitialized.current = false
        }
      }

      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  const handleReset = () => {
    setLocationId(match.locationId ?? '')
    setTime(match.time ?? new Date().toISOString().slice(0, 16))
    // 審判を matchData から復元
    const j = matchData?.match?.judgment
    if (j?.group?.id) { setJudgmentType('group'); setJudgmentTargetId(j.group.id) }
    else if (j?.team?.id) { setJudgmentType('team'); setJudgmentTargetId(j.team.id) }
    else if (j?.user?.id) { setJudgmentType('user'); setJudgmentTargetId(j.user.id) }
    else { setJudgmentType(null); setJudgmentTargetId('') }
  }

  return {
    locationId, setLocationId,
    locations,
    time, setTime,
    judgmentType, setJudgmentType,
    judgmentTargetId, setJudgmentTargetId,
    optionsByType,
    currentJudgmentLabel,
    handleSave, handleReset,
    error: mutationError,
  }
}
