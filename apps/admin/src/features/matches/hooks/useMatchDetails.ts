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
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'

export type JudgeType = 'group' | 'team' | 'user'

export type JudgeOption = { id: string; name: string }

type CompetitionJudgeData = {
  competition: {
    id: string
    teams: Array<{
      id: string
      name: string
      group: { id: string; name: string }
      users: Array<{ id: string; name?: string | null; identify?: { microsoftUserId?: string | null } | null }>
    }>
  }
}

export function useMatchDetails(match: ActiveMatch, competitionId?: string) {
  const [locationId, setLocationId] = useState(match.locationId ?? '')
  const [time, setTime] = useState(toDatetimeLocal(match.time))
  const [judgmentType, setJudgmentType] = useState<JudgeType | null>(null)
  const [judgmentTargetId, setJudgmentTargetId] = useState('')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  // dirty 検知用の初期値
  const [savedLocationId, setSavedLocationId] = useState(match.locationId ?? '')
  const [savedTime, setSavedTime] = useState(toDatetimeLocal(match.time))
  const [savedJudgmentType, setSavedJudgmentType] = useState<JudgeType | null>(null)
  const [savedJudgmentTargetId, setSavedJudgmentTargetId] = useState('')

  const dirty =
    locationId !== savedLocationId ||
    time !== savedTime ||
    judgmentType !== savedJudgmentType ||
    judgmentTargetId !== savedJudgmentTargetId

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
      setSavedJudgmentType('group')
      setSavedJudgmentTargetId(j.group.id)
    } else if (j.team?.id) {
      setJudgmentType('team')
      setJudgmentTargetId(j.team.id)
      setSavedJudgmentType('team')
      setSavedJudgmentTargetId(j.team.id)
    } else if (j.user?.id) {
      setJudgmentType('user')
      setJudgmentTargetId(j.user.id)
      setSavedJudgmentType('user')
      setSavedJudgmentTargetId(j.user.id)
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

  // 大会エントリーのユーザーから microsoftUserId を収集して Graph API で名前を取得
  const microsoftUserIds = useMemo(() => {
    const teams = compData?.competition?.teams ?? []
    const ids: string[] = []
    for (const team of teams) {
      for (const user of team.users ?? []) {
        const msId = user.identify?.microsoftUserId
        if (msId) ids.push(msId)
      }
    }
    return ids
  }, [compData])

  const { msGraphUsers } = useMsGraphUsers(microsoftUserIds)

  const judgeOptions = useMemo(() => {
    const teams = compData?.competition?.teams ?? []
    const groupMap = new Map<string, JudgeOption>()
    const userMap = new Map<string, JudgeOption>()

    for (const team of teams) {
      if (team.group) groupMap.set(team.group.id, { id: team.group.id, name: team.group.name })
      for (const user of team.users ?? []) {
        const msId = user.identify?.microsoftUserId
        const msUser = msId ? msGraphUsers.get(msId) : undefined
        const name = msUser?.displayName ?? user.name ?? user.id
        userMap.set(user.id, { id: user.id, name })
      }
    }

    return {
      groups: Array.from(groupMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      teams: teams.map(t => ({ id: t.id, name: t.name })).sort((a, b) => a.name.localeCompare(b.name)),
      users: Array.from(userMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    }
  }, [compData, msGraphUsers])

  const optionsByType: Record<JudgeType, JudgeOption[]> = {
    group: judgeOptions.groups,
    team: judgeOptions.teams,
    user: judgeOptions.users,
  }

  // 現在設定されている審判の表示名（MatchEditPage の情報タグ用）
  const currentJudgmentLabel = useMemo(() => {
    const j = matchData?.match?.judgment
    if (!j) return undefined
    return j.team?.name ?? j.group?.name ?? j.name ?? undefined
  }, [matchData])

  const handleSave = async () => {
    if (!time) return
    try {
      await updateMatchDetail({
        variables: {
          id: match.id,
          input: { time: new Date(time).toISOString(), locationId: locationId || undefined },
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
      setSavedLocationId(locationId)
      setSavedTime(time)
      setSavedJudgmentType(judgmentType)
      setSavedJudgmentTargetId(judgmentTargetId)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  const handleReset = () => {
    setLocationId(match.locationId ?? '')
    setTime(toDatetimeLocal(match.time))
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
    dirty,
    handleSave, handleReset,
    error: mutationError,
  }
}

function toDatetimeLocal(isoString?: string): string {
  if (!isoString) return new Date().toISOString().slice(0, 16)
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 16)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
