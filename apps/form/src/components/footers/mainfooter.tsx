"use client";

import { Box, Grid, useTheme } from "@mui/material";
import GoFinal from "../buttons/gofinalbutton";

export default function MainFooter() {
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
        px: { xs: "16px", md: "32px" },
        py: "8px",
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Grid container spacing={"16px"} sx={{ justifyContent: "flex-end" }}>
        <Grid item xs={12} sm={4} md={3} lg={2}>
          <GoFinal />
        </Grid>
      </Grid>
    </Box>
  );
}
