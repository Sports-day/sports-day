"use client";

import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import SubmitButton from "../buttons/SubmitButton";
import BackButton from "../buttons/BackButton";

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
        px: "50px",
        py: "8px",
      }}
    >
      <Grid
        container
        sx={{
          justifyContent: "flex-end",
          width: "100%",
          columnGap: "16px",
          rowGap: "8px",
        }}
      >
        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          <BackButton />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
}
