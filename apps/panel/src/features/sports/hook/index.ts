import {
  useGetPanelSportsQuery,
  useGetPanelSportQuery,
  useGetPanelSportCompetitionsQuery,
  useGetPanelMatchesQuery,
  MatchStatus,
} from "@/src/gql/__generated__/graphql";

/**
 * Fetches all sports
 * NOTE: filter パラメータは旧 REST API 用。GraphQL では未使用だが、
 * 呼び出し元の互換性のためシグネチャを維持する。
 */
export const useFetchSports = (_filter: boolean = false) => {
  const { data, loading, refetch } = useGetPanelSportsQuery();
  return {
    sports: data?.sports ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

/**
 * Fetches a sport by ID
 */
export const useFetchSport = (sportId: string) => {
  const { data, loading, refetch } = useGetPanelSportQuery({
    variables: { id: sportId },
    skip: !sportId,
  });
  return {
    sport: data?.sport,
    isFetching: loading,
    refresh: refetch,
  };
};

/**
 * Fetches the competitions (games) of a sport.
 * 旧 Game モデルは新スキーマの Competition に相当する。
 * 返す型は GraphQL の SportScene（competition 情報を含む）。
 *
 * NOTE: filter パラメータは旧 REST API 用。GraphQL では未使用。
 */
export const useFetchSportGames = (sportId: string, _filter: boolean = false) => {
  const { data, loading, refetch } = useGetPanelSportCompetitionsQuery({
    variables: { id: sportId },
    skip: !sportId,
  });
  // 旧 Game → 新 SportScene のマッピング。呼び出し元は型変更への対応が必要。
  return {
    games: data?.sport?.scene ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export type BestTeam = {
  team: { id: string; name: string };
  rank: number;
};

export const useFetchSportBest3 = () => {
  // sport をまたいだランキング集計は未実装のため空実装とする
  return {
    bestTeams: [] as BestTeam[],
    isFetching: false,
  };
};

export const useFetchSportProgress = (sportId: string | number) => {
  const sportIdStr = String(sportId)
  const { sport, isFetching: isSportFetching } = useFetchSport(sportIdStr)
  const { data: matchesData, loading: isMatchesFetching } = useGetPanelMatchesQuery()

  // sport.scene[].scene.id に一致する competition の match を抽出
  const sceneIds = new Set((sport?.scene ?? []).map(ss => ss.scene.id))
  const sportMatches = (matchesData?.matches ?? []).filter(m =>
    sceneIds.has(m.competition.scene.id)
  )

  const total = sportMatches.length
  const finished = sportMatches.filter(m => m.status === MatchStatus.Finished).length
  const progress = total > 0 ? finished / total : 0

  return {
    progress,
    isFetching: isSportFetching || isMatchesFetching,
    refresh: () => Promise.resolve({}),
  };
};
