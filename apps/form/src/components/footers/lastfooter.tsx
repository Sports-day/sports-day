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
        height: "60px",
        background: theme.palette.background.default,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        p: theme.spacing(1),
      }}
    >
      <Grid container spacing={2} sx={{ justifyContent: "flex-end", mr: "6%" }}>
        <Grid item lg={2}>
          <BackButton />
        </Grid>
        <Grid item lg={2}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
}
