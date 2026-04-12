import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetJudgeMatchAtLocationLazyQuery,
  useStartMatchJudgingMutation,
  type GetJudgeMatchAtLocationQuery,
} from "@/src/gql/__generated__/graphql";

export type JudgeMatch = NonNullable<GetJudgeMatchAtLocationQuery["nextJudgeMatchAtLocation"]>;

type JudgeFlowState =
  | "loading"
  | "no-match"
  | "starting"
  | "ready"
  | "done"
  | "error";

type JudgeFlowResult = {
  state: JudgeFlowState;
  match: JudgeMatch | null;
  error: string | null;
  handleScoreSubmitted: () => void;
};

export function useJudgeFlow(locationId: string): JudgeFlowResult {
  const [state, setState] = useState<JudgeFlowState>("loading");
  const [currentMatch, setCurrentMatch] = useState<JudgeMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasSubmittedRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRY = 10;

  const [fetchMatch] = useGetJudgeMatchAtLocationLazyQuery({
    fetchPolicy: "network-only",
  });
  const [startMatchJudging] = useStartMatchJudgingMutation();

  // 試合を探して開始する一連のフロー
  const findAndStartMatch = useCallback(async () => {
    setState("loading");
    setCurrentMatch(null);

    try {
      const { data } = await fetchMatch({ variables: { locationId } });
      const match = data?.nextJudgeMatchAtLocation ?? null;

      if (!match) {
        setState(hasSubmittedRef.current ? "done" : "no-match");
        retryCountRef.current = 0;
        return;
      }

      // 既にONGOINGで出席済みならスコア入力へ直行
      if (match.status === "ONGOING" && match.judgment?.isAttending) {
        setCurrentMatch(match);
        setState("ready");
        retryCountRef.current = 0;
        return;
      }

      // startMatchJudging を実行
      setState("starting");
      const result = await startMatchJudging({
        variables: { matchId: match.id },
      });

      const updated = result.data?.startMatchJudging;
      if (updated) {
        setCurrentMatch(updated as JudgeMatch);
        setState("ready");
        retryCountRef.current = 0;
      } else {
        setState("error");
        setError("試合の開始に失敗しました");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("NOT_ASSIGNED_REFEREE")) {
        setState("no-match");
      } else if (message.includes("MATCH_ALREADY_FINISHED")) {
        // 既にFINISHED → 次の試合を探す（再帰、上限あり）
        retryCountRef.current += 1;
        if (retryCountRef.current < MAX_RETRY) {
          findAndStartMatch();
        } else {
          setState("no-match");
          retryCountRef.current = 0;
        }
      } else {
        setState("error");
        setError(message || "エラーが発生しました");
      }
    }
  }, [locationId, fetchMatch, startMatchJudging]);

  // 初回マウント時に実行
  useEffect(() => {
    findAndStartMatch();
  }, [findAndStartMatch]);

  // スコア提出完了後に次の試合を探す
  const handleScoreSubmitted = useCallback(() => {
    hasSubmittedRef.current = true;
    findAndStartMatch();
  }, [findAndStartMatch]);

  return {
    state,
    match: currentMatch,
    error,
    handleScoreSubmitted,
  };
}
