import {
  useGetPanelSportsQuery,
  useGetPanelSportQuery,
  useGetPanelSportCompetitionsQuery,
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

/**
 * 【未確定】旧実装は GameModel の LeagueResult を集計してベスト3を算出していた。
 * 新スキーマでは Competition/League 経由の集計が必要だが、
 * 現時点では GraphQL に該当する集計クエリがないため空実装とする。
 */
export const useFetchSportBest3 = () => {
  // TODO: GraphQL の leagueStandings 等を使って集計ロジックを実装する
  return {
    bestTeams: [] as BestTeam[],
    isFetching: false,
  };
};

/**
 * 【未確定】旧実装は REST API の getProgress を使っていた。
 * 新スキーマでは sport.scene → competitions → matches の status から
 * 進捗率を計算する必要があるが、集計ロジックが複雑なため空実装とする。
 */
export const useFetchSportProgress = (_sportId: string) => {
  // TODO: sport の scene 内 competition の match 進捗から計算する
  return {
    progress: 0,
    isFetching: false,
    refresh: () => Promise.resolve({} as any),
  };
};
