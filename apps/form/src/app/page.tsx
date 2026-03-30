"use client";

import { Box, Typography, Stack, Button, useTheme } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import PrivacyPolicyDrawer from "@/components/layouts/PrivacyPolicyDrawer";
import CircularUnderLoad from "@/features/Loading";

const GET_TYPE = gql`
  query GetType {
    scenes {
      id
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_TYPE, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
  const router = useRouter();
  const theme = useTheme();

  const firstSceneId = data?.scenes?.[0]?.id;

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
            py: "24px",
          }}
        >
          <Image
            src="/images/logo_form.png"
            alt=""
            width={320}
            height={28}
            style={{ width: "min(320px, 78vw)", height: "auto" }}
          />
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "15px", sm: "18px" },
              textAlign: "center",
            }}
          >
            球技大会のチーム登録プラットフォーム
          </Typography>

          <Box sx={{ width: "min(320px, 100%)", mt: "12px" }}>
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
                    router.push(`/weather/${firstSceneId}`);
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

          <Stack
            spacing={"16px"}
            direction="row"
            sx={{ mt: { xs: "32px", md: "64px" } }}
          >
            <Typography sx={{ color: "white", opacity: 0.5, fontSize: "20px" }}>
              (C)
            </Typography>
            <Image
              src="/images/wider_horiz.png"
              alt=""
              width={160}
              height={130}
              style={{
                opacity: 0.5,
                width: "min(160px, 44vw)",
                height: "auto",
              }}
            />
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
}
