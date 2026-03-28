"use client";

import { Box, useTheme } from "@mui/material";
import BackButton from "../buttons/backbutton";

export default function SubFooter() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        minHeight: "72px",
        background: theme.palette.background.default,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: { xs: 2, md: 4 },
        py: 1,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 280, md: 320 }, maxWidth: "100%" }}>
        <BackButton />
      </Box>
    </Box>
  );
}
