import { Box, Typography, Stack, Grid } from "@mui/material";
import SubmitButton from "../buttons/submitbutton";
import BackButton from "../buttons/backbutton";

export default function LastFooter() {
  return (
    <Box
      sx={{
        position: "relative",
        bottom: 0,
        width: "100%",
        height: "60px",
        background: "#3E4CB2",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        p: "3vh",
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
