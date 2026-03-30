"use client";

import { Box, Typography, Stack } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

export default function Comp() {
  const submitBackground = useTheme().palette.background.default;
  return (
    <Box
      sx={{
        background: submitBackground,
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
          background: submitBackground,
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
            py: "32px",
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
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            style={{ marginTop: "16px" }}
          >
            <Stack
              spacing={"16px"}
              direction="row"
              alignItems="center"
              sx={{ mt: "16px" }}
            >
              <Box
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "22px",
                  lineHeight: 1,
                }}
              >
                ✓
              </Box>
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "20px", sm: "25px" },
                  textAlign: "center",
                }}
              >
                回答を送信しました
              </Typography>
            </Stack>
          </motion.div>

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
              <Image
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
