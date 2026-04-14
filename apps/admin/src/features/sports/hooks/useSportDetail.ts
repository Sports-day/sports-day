import { useState, useEffect, useMemo, useRef } from 'react'
import {
  useGetAdminSportQuery,
  useGetAdminSportsQuery,
  useUpdateAdminSportMutation,
  useDeleteAdminSportMutation,
  useSetAdminRankingRulesMutation,
  useGetAdminScenesForSportsQuery,
  useAddAdminSportScenesMutation,
  useDeleteAdminSportSceneMutation,
  GetAdminSportsDocument,
  RankingConditionKey,
} from '@/gql/__generated__/graphql'
import { useImages } from '@/features/images/hooks/useImages'
import { showApiErrorToast } from '@/lib/toast'

const RANKING_CONDITION_OPTIONS: { value: RankingConditionKey; label: string }[] = [
  { value: RankingConditionKey.WinPoints, label: '勝ち点' },
  { value: RankingConditionKey.GoalDiff, label: '得失点差' },
  { value: RankingConditionKey.TotalGoals, label: '総得点' },
  { value: RankingConditionKey.HeadToHead, label: '直接対決' },
  { value: RankingConditionKey.AdminDecision, label: '管理者判定' },
]

type SportSceneEntry = { sportSceneId: string; sceneId: string }

type Snapshot = {
  name: string
  displayOrder: number
  experiencedLimit: number | null
  rankingKeys: RankingConditionKey[]
  imageId: string | null
  sceneIds: string[]
  sportScenes: SportSceneEntry[]
}

const EMPTY: Snapshot = { name: '', displayOrder: 0, experiencedLimit: null, rankingKeys: [], imageId: null, sceneIds: [], sportScenes: [] }

export function useSportDetail(sportId: string, onDelete: () => void) {
  const { data, loading, error, refetch } = useGetAdminSportQuery({ variables: { id: sportId }, fetchPolicy: 'cache-and-network' })
  const { data: allSportsData } = useGetAdminSportsQuery({ fetchPolicy: 'cache-and-network' })
  const { data: images } = useImages()
  const sport = data?.sport

  // フォーム状態
  const [name, setName] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [experiencedLimit, setExperiencedLimit] = useState<number | null>(null)
  const [rankingKeys, setRankingKeys] = useState<RankingConditionKey[]>([])
  const [imageId, setImageId] = useState<string | null>(null)
  const [sceneIds, setSceneIds] = useState<string[]>([])

  // 「最後に保存された状態」— dirty検出に使用
  const [saved, setSaved] = useState<Snapshot>(EMPTY)

  // シーン一覧
  const { data: scenesData } = useGetAdminScenesForSportsQuery({ fetchPolicy: 'cache-and-network' })
  const allScenes = useMemo(() => (scenesData?.scenes ?? []).filter(s => !s.isDeleted), [scenesData])

  // 初回のみAPIデータでフォームを初期化（保存中のリセットを防ぐ）
  const initialized = useRef(false)
  useEffect(() => {
    if (!sport || initialized.current) return
    initialized.current = true
    const sorted = [...(sport.rankingRules ?? [])].sort((a, b) => a.priority - b.priority)
    const sportScenes: SportSceneEntry[] = (sport.scene ?? []).map(ss => ({
      sportSceneId: ss.id,
      sceneId: ss.scene.id,
    }))
    const snap: Snapshot = {
      name: sport.name,
      displayOrder: sport.displayOrder,
      experiencedLimit: sport.experiencedLimit ?? null,
      rankingKeys: sorted.map(r => r.conditionKey),
      imageId: sport.image?.id ?? null,
      sceneIds: sportScenes.map(ss => ss.sceneId),
      sportScenes,
    }
    setName(snap.name)
    setDisplayOrder(snap.displayOrder)
    setExperiencedLimit(snap.experiencedLimit)
    setRankingKeys(snap.rankingKeys)
    setImageId(snap.imageId)
    setSceneIds(snap.sceneIds)
    setSaved(snap)
  }, [sport])

  // dirty = フォーム現在値と最後に保存された値の比較
  const dirty = name !== saved.name
    || experiencedLimit !== saved.experiencedLimit
    || imageId !== saved.imageId
    || JSON.stringify([...sceneIds].sort()) !== JSON.stringify([...saved.sceneIds].sort())
    || JSON.stringify(rankingKeys) !== JSON.stringify(saved.rankingKeys)

  const usedImageIds = useMemo(() => {
    const ids = new Set<string>()
    for (const s of allSportsData?.sports ?? []) {
      if (s.id !== sportId && s.image?.id) {
        ids.add(s.image.id)
      }
    }
    return ids
  }, [allSportsData, sportId])

  // ミューテーション
  const [updateSport] = useUpdateAdminSportMutation({
    refetchQueries: [{ query: GetAdminSportsDocument }],
  })
  const [deleteSport] = useDeleteAdminSportMutation({
    refetchQueries: [{ query: GetAdminSportsDocument }],
  })
  const [doSetRankingRules] = useSetAdminRankingRulesMutation()
  const [addSportScenes] = useAddAdminSportScenesMutation()
  const [deleteSportScene] = useDeleteAdminSportSceneMutation()

  const handleSave = async () => {
    if (!name.trim()) return
    // クロージャの値をローカル変数に固定
    const n = name.slice(0, 64)
    const w = displayOrder
    const el = experiencedLimit
    const img = imageId
    const rk = [...rankingKeys]
    const sIds = [...sceneIds]
    const prev = { ...saved }

    try {
      // 1) 基本フィールド保存
      await updateSport({
        variables: { id: sportId, input: { name: n, displayOrder: w, experiencedLimit: el, imageId: img } },
      })

      // 2) 採点方式保存
      await doSetRankingRules({
        variables: {
          sportId,
          rules: rk.map((key, i) => ({ conditionKey: key, priority: i + 1 })),
        },
      })

      // 3) シーン保存（差分のみ）
      const prevSceneIdSet = new Set(prev.sceneIds)
      const newSceneIdSet = new Set(sIds)

      // 削除: 以前あったが今はないもの
      const toDelete = prev.sportScenes.filter(ss => !newSceneIdSet.has(ss.sceneId))
      for (const ss of toDelete) {
        await deleteSportScene({ variables: { id: ss.sportSceneId } })
      }

      // 追加: 今あるが以前なかったもの
      const toAdd = sIds.filter(id => !prevSceneIdSet.has(id))
      for (const sceneId of toAdd) {
        await addSportScenes({ variables: { id: sceneId, input: { sportIds: [sportId] } } })
      }

      // 4) refetchしてsportSceneを最新化
      const { data: refreshed } = await refetch()
      const newSportScenes: SportSceneEntry[] = (refreshed?.sport?.scene ?? []).map(ss => ({
        sportSceneId: ss.id,
        sceneId: ss.scene.id,
      }))

      // 5) savedをフォーム値で更新 → dirty = false
      setSaved({
        name: n,
        displayOrder: w,
        experiencedLimit: el,
        imageId: img,
        sceneIds: sIds,
        rankingKeys: rk,
        sportScenes: newSportScenes,
      })
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSport({ variables: { id: sportId } })
      onDelete()
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  return {
    sport,
    name,
    setName,
    experiencedLimit,
    setExperiencedLimit,
    imageId,
    setImageId,
    images,
    usedImageIds,
    rankingKeys,
    setRankingKeys,
    rankingConditionOptions: RANKING_CONDITION_OPTIONS,
    sceneIds,
    setSceneIds,
    allScenes,
    dirty,
    handleSave,
    handleDelete,
    loading,
    error: error ?? null,
  }
}
