import Box from "@mui/material/Box";
import faviconIco from "@/assets/favicon.ico";

export default function CircularUnderLoad() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1401,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src={faviconIco}
        alt="Loading"
        sx={{
          width: "30px",
          height: "30px",
          objectFit: "contain",
          animation: "logo-spin 1.2s linear infinite",
          "@keyframes logo-spin": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
        }}
      />
    </Box>
  );
}
