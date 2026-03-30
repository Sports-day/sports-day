import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function CircularUnderLoad() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "24px",
      }}
    >
      <CircularProgress disableShrink />
    </Box>
  );
}
