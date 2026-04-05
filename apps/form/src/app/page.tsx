import { Box, Typography, Stack, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PrivacyPolicyDrawer from "@/components/layouts/PrivacyPolicyDrawer";
import CircularUnderLoad from "@/features/Loading";
import { useGetTypeQuery } from "@/gql/__generated__/graphql";

export default function Home() {
  const { data, loading, error } = useGetTypeQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
  const navigate = useNavigate();
  const theme = useTheme();

  const firstSceneId = data?.scenes?.filter((s) => !s.isDeleted)?.[0]?.id;

  if (loading) {
    return <CircularUnderLoad />;
  }

  if (error) {
    throw error;
  }

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          width: "100%",
          minHeight: "100dvh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            px: "16px",
            py: "16px",
          }}
        >
          <img
            src="/images/logo_form.png"
            alt=""
            width={380}
            height={30}
            style={{ width: "min(380px, 78vw)", height: "auto" }}
          />
          <Typography
            sx={{
              color: "white",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            球技大会のチーム登録プラットフォーム
          </Typography>

          <Box sx={{ width: "min(320px, 100%)", mt: "32px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              style={{ width: "100%" }}
            >
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                disabled={loading || !firstSceneId}
                onClick={() => {
                  if (firstSceneId) {
                    navigate(`/weather/${firstSceneId}`);
                  }
                }}
                sx={{
                  width: "100%",
                  background: theme.palette.button.veryLight,
                  borderRadius: "10px",
                  "&:hover": {
                    background: theme.palette.button.veryLight,
                    borderRadius: "10px",
                    opacity: 0.9,
                  },
                }}
              >
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.buttonFont2,
                  })}
                >
                  回答へ進む
                </Typography>
              </Button>
            </motion.div>
          </Box>
          <Box sx={{ width: "min(320px, 100%)", mt: "16px" }}>
            <PrivacyPolicyDrawer>プライバシーポリシー</PrivacyPolicyDrawer>
          </Box>

          <Stack direction="row" spacing={"8px"} sx={{ mt: "32px" }}>
            <Typography
              sx={{
                color: "white",
                opacity: 0.3,
                fontSize: "20px",
                lineHeight: 1,
              }}
            >
              (C)
            </Typography>
            <Box>
              <img
                src="/images/wider_horiz.png"
                alt=""
                width={160}
                height={48}
                style={{
                  opacity: 0.3,
                  width: "min(160px, 44vw)",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
}
