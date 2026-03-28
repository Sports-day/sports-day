"use client";

import { Box, Stack } from "@mui/material";
import Header from "@/components/header/header";
import Warning from "@/components/cards/AboutAnyPage/warningCard";
import ConfirmPage from "@/features/confirmpage";
import LastFooter from "@/components/footers/lastfooter";

export default function Confirm() {
  return (
    <Box sx={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Stack
        direction="column"
        sx={{
          width: "100%",
          flex: 1,
          px: { xs: 2, sm: 3, md: 6 },
          py: 1,
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
