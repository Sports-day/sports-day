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
        px: { xs: 2, md: 4 },
        py: 1,
      }}
    >
      <Grid container sx={{ justifyContent: "flex-end" }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <BackButton />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
}
