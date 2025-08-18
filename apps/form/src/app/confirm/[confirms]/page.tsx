import { Box, Stack } from "@mui/material";
import Header from "@/components/header/header";
import Warning from "@/components/cards/AboutAnyPage/warningCard";
import ConfirmPage from "@/features/confirmpage";
import LastFooter from "@/components/footers/lastfooter";

export default function Confirm() {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Header />
      <Stack
        direction="column"
        sx={{ height: "100%", width: "100%", p: "3vh" }}
      >
        <Warning warncomment="全員が正しくチームに登録されているかを確認してください"></Warning>
        <ConfirmPage />
      </Stack>
      <LastFooter />
    </Box>
  );
}
