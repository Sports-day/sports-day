import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useJudgeFlow } from "@/src/features/matches/hook/useJudgeFlow";
import { ScoreSubmitDialog } from "@/components/dashboard/schedule/ScoreSubmitDialog";
import DashboardPage from "@/app/(authenticated)/page";

export default function JudgePage() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { state, match, error, handleScoreSubmitted } = useJudgeFlow(locationId ?? "");

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  // 審判対象の試合なし / 全試合完了 → ホームへリダイレクト（useEffect内で安全に実行）
  useEffect(() => {
    if (state === "no-match" || state === "done") {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // ローディング・試合開始中: ダッシュボードの上にスピナー
  if (state === "loading" || state === "starting") {
    return (
      <>
        <DashboardPage />
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${theme.palette.background.default}CC`,
          }}
        >
          <CircularProgress />
          <Typography color={theme.palette.text.primary} fontSize="14px" sx={{ mt: 2 }}>
            {state === "loading" ? "試合を検索中..." : "試合を開始中..."}
          </Typography>
        </Box>
      </>
    );
  }

  // 審判対象の試合なし / 全試合完了 / エラー
  if (state === "no-match" || state === "done" || state === "error") {
    return (
      <>
        <DashboardPage />
        {state === "error" && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${theme.palette.background.default}CC`,
            }}
          >
            <Typography color="error" fontSize="14px">
              {error ?? "エラーが発生しました"}
            </Typography>
            <Typography
              color={theme.palette.text.secondary}
              fontSize="12px"
              sx={{ mt: 1, cursor: "pointer", textDecoration: "underline" }}
              onClick={handleGoHome}
            >
              ホームに戻る
            </Typography>
          </Box>
        )}
      </>
    );
  }

  // スコア入力画面 (state === "ready")
  if (!match) return <DashboardPage />;

  return (
    <>
      <DashboardPage />
      <ScoreSubmitDialog
        match={match}
        open={true}
        onClose={handleGoHome}
        onSubmitSuccess={handleScoreSubmitted}
      />
    </>
  );
}
