import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import { useSubmitPanelMatchScoreMutation } from "@/src/gql/__generated__/graphql";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

type Props = {
  match: PanelMatch;
  open: boolean;
  onClose: () => void;
};

export const ScoreSubmitDialog = ({ match, open, onClose }: Props) => {
  const theme = useTheme();
  const [submitScore, { loading }] = useSubmitPanelMatchScoreMutation();

  const entry0 = match.entries[0];
  const entry1 = match.entries[1];
  const team0Name = entry0?.team?.name ?? "チームA";
  const team1Name = entry1?.team?.name ?? "チームB";

  const [score0, setScore0] = React.useState("");
  const [score1, setScore1] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // ダイアログ開閉時にstateをリセット
  React.useEffect(() => {
    if (!open) {
      setScore0("");
      setScore1("");
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    const s0 = parseInt(score0, 10);
    const s1 = parseInt(score1, 10);

    if (isNaN(s0) || isNaN(s1) || s0 < 0 || s1 < 0) {
      setError("有効なスコアを入力してください");
      return;
    }

    // トーナメントの引き分けチェック
    const isTournament = match.competition.type === "TOURNAMENT";
    if (isTournament && s0 === s1) {
      setError("トーナメントでは引き分けは許可されていません。スコアを修正してください");
      return;
    }

    const results = [];
    if (entry0?.team?.id) {
      results.push({ teamId: entry0.team.id, score: s0 });
    }
    if (entry1?.team?.id) {
      results.push({ teamId: entry1.team.id, score: s1 });
    }

    // 勝者判定
    let winnerTeamId: string | undefined;
    if (s0 > s1 && entry0?.team?.id) {
      winnerTeamId = entry0.team.id;
    } else if (s1 > s0 && entry1?.team?.id) {
      winnerTeamId = entry1.team.id;
    }

    try {
      await submitScore({
        variables: {
          matchId: match.id,
          input: {
            results,
            winnerTeamId: winnerTeamId ?? null,
          },
        },
        refetchQueries: ["GetPanelMatches"],
      });
      setScore0("");
      setScore1("");
      setError(null);
      onClose();
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "スコアの提出に失敗しました";
      setError(message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.background.default,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        スコア入力
      </DialogTitle>
      <DialogContent
        sx={{ backgroundColor: theme.palette.background.default, pt: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <TextField
                type="number"
                value={score0}
                onChange={(e) => setScore0(e.target.value)}
                inputProps={{ min: 0, max: 999, style: { textAlign: "center", fontSize: "20px" } }}
                sx={{ width: "100%" }}
                size="small"
              />
              <Typography
                fontSize="12px"
                color={theme.palette.text.secondary}
                noWrap
              >
                {team0Name}
              </Typography>
            </Box>
            <Typography
              fontSize="18px"
              fontWeight={600}
              color={theme.palette.text.secondary}
              sx={{ pt: 0.8 }}
            >
              -
            </Typography>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <TextField
                type="number"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                inputProps={{ min: 0, max: 999, style: { textAlign: "center", fontSize: "20px" } }}
                sx={{ width: "100%" }}
                size="small"
              />
              <Typography
                fontSize="12px"
                color={theme.palette.text.secondary}
                noWrap
              >
                {team1Name}
              </Typography>
            </Box>
          </Box>
          {error && (
            <Typography
              fontSize="12px"
              color="error"
              textAlign="center"
            >
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: theme.palette.background.default,
          px: 3,
          pb: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            flex: 3,
            minWidth: 0,
            fontSize: "13px",
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.text.primary}4D`,
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
              border: `1px solid ${theme.palette.text.primary}80`,
            },
          }}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            flex: 7,
            fontSize: "13px",
            backgroundColor: `${theme.palette.text.primary}CC`,
            color: theme.palette.background.default,
            borderRadius: "10px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: theme.palette.text.primary,
            },
          }}
        >
          提出する
        </Button>
      </DialogActions>
    </Dialog>
  );
};
