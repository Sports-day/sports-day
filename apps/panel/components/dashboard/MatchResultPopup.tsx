import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

type Props = {
  myTeamMatches: PanelMatch[];
};

/**
 * アプリ起動時にFINISHED試合の結果をポップアップ表示する。
 * state管理のみ（localStorageなし）。OKで消えるが、次回アプリ起動時にまた表示される。
 */
export const MatchResultPopup = ({ myTeamMatches }: Props) => {
  const theme = useTheme();
  const [queue, setQueue] = useState<string[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    // 初回データ取得時のみキューを構築。refetchでは追加しない
    if (initializedRef.current) return;
    const finishedIds = myTeamMatches
      .filter((m) => m.status === "FINISHED")
      .map((m) => m.id);
    if (finishedIds.length > 0) {
      setQueue(finishedIds);
      initializedRef.current = true;
    }
  }, [myTeamMatches]);

  const currentMatchId = queue[0];
  const currentMatch = myTeamMatches.find((m) => m.id === currentMatchId);

  if (!currentMatch) return null;

  const entry0 = currentMatch.entries[0];
  const entry1 = currentMatch.entries[1];
  const team0Name = entry0?.team?.name ?? "—";
  const team1Name = entry1?.team?.name ?? "—";
  const score0 = entry0?.score ?? 0;
  const score1 = entry1?.score ?? 0;
  const winnerId = currentMatch.winnerTeam?.id;

  const handleClose = () => {
    setQueue((prev) => prev.slice(1));
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.background.default,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        試合結果
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            py: 2,
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              fontSize="16px"
              fontWeight={600}
              color={
                winnerId === entry0?.team?.id
                  ? theme.palette.success.main
                  : theme.palette.text.primary
              }
            >
              {team0Name}
            </Typography>
            {winnerId === entry0?.team?.id && (
              <Typography fontSize="11px" color="success.main">
                WIN
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography fontSize="28px" fontWeight={700} color={theme.palette.text.primary}>
              {score0} - {score1}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              fontSize="16px"
              fontWeight={600}
              color={
                winnerId === entry1?.team?.id
                  ? theme.palette.success.main
                  : theme.palette.text.primary
              }
            >
              {team1Name}
            </Typography>
            {winnerId === entry1?.team?.id && (
              <Typography fontSize="11px" color="success.main">
                WIN
              </Typography>
            )}
          </Box>
        </Box>
        {queue.length > 1 && (
          <Typography
            fontSize="11px"
            color={theme.palette.text.secondary}
            textAlign="center"
          >
            1 / {queue.length} 件
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.background.default, justifyContent: "center" }}>
        <Button onClick={handleClose} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
