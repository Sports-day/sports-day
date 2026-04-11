import { Box, Stack, Typography } from "@mui/material";
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
          px: "50px",
          py: "16px",
        }}
      >
        <Warning warncomment="全員が正しくチームに登録されているかを確認してください"></Warning>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", mb: "8px" }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#FF9800", flexShrink: 0 }} />
          <Typography sx={{ fontSize: "11px", color: "#999", lineHeight: 1 }}>経験者</Typography>
        </Box>
        <ConfirmPage />
      </Stack>
      <LastFooter />
    </Box>
  );
}
