import { useState, useEffect, useRef } from "react";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import { ScoreSubmitDialog } from "@/components/dashboard/schedule/ScoreSubmitDialog";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

type Props = {
  judgeMatches: PanelMatch[];
};

/**
 * 審判として出席済み + ONGOING の試合がある場合、
 * アプリ起動時にスコア入力ダイアログを自動表示する。
 */
export const JudgeScoreReminder = ({ judgeMatches }: Props) => {
  const [targetMatch, setTargetMatch] = useState<PanelMatch | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const pendingMatch = judgeMatches.find(
      (m) =>
        m.status === "ONGOING" &&
        m.judgment?.isAttending === true,
    );

    if (pendingMatch) {
      setTargetMatch(pendingMatch);
      initializedRef.current = true;
    }
  }, [judgeMatches]);

  if (!targetMatch) return null;

  return (
    <ScoreSubmitDialog
      match={targetMatch}
      open={true}
      onClose={() => setTargetMatch(null)}
    />
  );
};
