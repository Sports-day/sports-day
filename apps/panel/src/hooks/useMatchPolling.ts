import { useEffect, useRef } from "react";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import { notify } from "@/src/lib/notifications";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

const POLLING_INTERVAL = 30_000; // 30秒
const APPROACHING_MINUTES = 3;
const STORAGE_KEY = "notified_approaching_matches";

function getNotifiedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveNotifiedSet(set: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

/**
 * 審判試合の接近を検出して通知イベントを発火する。
 * refetch関数を30秒間隔で呼び出してデータを最新に保つ。
 */
export function useMatchPolling(
  judgeMatches: PanelMatch[],
  refetchMatches: () => Promise<unknown>,
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ポーリング
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      refetchMatches();
    }, POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refetchMatches]);

  // 試合接近検出
  useEffect(() => {
    const now = new Date();
    const notified = getNotifiedSet();
    let updated = false;

    for (const match of judgeMatches) {
      if (match.status === "FINISHED" || match.status === "CANCELED") continue;
      if (notified.has(match.id)) continue;

      const matchTime = new Date(match.time);
      const diffMs = matchTime.getTime() - now.getTime();
      const diffMin = diffMs / 60_000;

      if (diffMin <= APPROACHING_MINUTES && diffMin > -5) {
        notify({
          type: "MATCH_APPROACHING",
          matchId: match.id,
          minutesBefore: Math.max(0, Math.round(diffMin)),
        });
        notified.add(match.id);
        updated = true;
      }
    }

    if (updated) saveNotifiedSet(notified);
  }, [judgeMatches]);
}
