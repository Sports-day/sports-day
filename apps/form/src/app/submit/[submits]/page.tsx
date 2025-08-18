"use client";

import { Box, Typography, Stack } from "@mui/material";
import Image from "next/image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";

export default function Comp() {
  return (
    <Box
      sx={{
        background: "#3E4CB2",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: "#3E4CB2",
          width: "100%",
          minHeight: "100vh",
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
          }}
        >
          <Image src="/images/logo_form.png" alt="" width={320} height={28} />
          <Typography sx={{ color: "white", fontsize: "18px" }}>
            球技大会のチーム登録プラットフォーム
          </Typography>
          <br />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          >
            <Stack spacing={3} direction="row">
              <CheckCircleOutlineIcon
                sx={{ color: "white", fontSize: "35px" }}
              />
              <Typography sx={{ color: "white", fontSize: "25px" }}>
                回答を送信しました
              </Typography>
            </Stack>
          </motion.div>
          <br />
          <br />
          <br />
          <br />
          <Stack spacing={2} direction="row">
            <Typography sx={{ color: "white", opacity: 0.5, fontSize: "20px" }}>
              (C)
            </Typography>
            <Image
              src="/images/wider_horiz.png"
              alt=""
              width={160}
              height={130}
              style={{ opacity: 0.5 }}
            />
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
}
