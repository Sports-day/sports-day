import { Box, Typography } from "@mui/material";
import BackButton from "../buttons/backbutton";

export default function SubFooter() {
  return (
    <Box
      sx={{
        position: "fixed",
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
      <Box sx={{ pr: "10%", width: "26%" }}>
        <BackButton />
      </Box>
    </Box>
  );
}
