"use client";

import { Box, Grid, useTheme } from "@mui/material";
import SubmitButton from "../buttons/submitbutton";
import BackButton from "../buttons/backbutton";

export default function LastFooter() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        bottom: 0,
        width: "100%",
        minHeight: "72px",
        background: theme.palette.background.default,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: { xs: "16px", md: "32px" },
        py: "8px",
      }}
    >
      <Grid container spacing={2} sx={{ justifyContent: "flex-end" }}>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <BackButton />
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
}
