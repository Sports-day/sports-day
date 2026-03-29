"use client";

import { Box, Stack } from "@mui/material";
import Header from "@/components/header/Header";
import Warning from "@/components/cards/AboutAnyPage/WarningCard";
import ConfirmPage from "@/features/ConfirmPage";
import LastFooter from "@/components/footers/LastFooter";

export default function Confirm() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Stack
        direction="column"
        sx={{
          width: "100%",
          flex: 1,
          minHeight: 0,
          px: { xs: "16px", sm: "32px", md: "50px" },
          py: "8px",
          maxWidth: 1440,
          mx: "auto",
        }}
      >
        <Warning warncomment="全員が正しくチームに登録されているかを確認してください"></Warning>
        <ConfirmPage />
      </Stack>
      <LastFooter />
    </Box>
  );
}
