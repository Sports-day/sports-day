"use client";

import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import BackButton from "../buttons/BackButton";

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
        px: "50px",
        py: "8px",
        zIndex: theme.zIndex.appBar,
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
        <Grid size={{ xs: 12, sm: 4, md: 3, lg: 2 }}>
          <BackButton />
        </Grid>
      </Grid>
    </Box>
  );
}
