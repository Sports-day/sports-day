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
        width: "100%",
        height: "60px",
        background: theme.palette.background.default,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        p: "3vh",
      }}
    >
      <Box sx={{ pr: "10%", width: "26%" }}>
        <BackButton />
      </Box>
    </Box>
  );
}
