import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams, Link } from "react-router-dom";

export default function Header() {
  const theme = useTheme();
  const { type } = useParams() as { type: string };
  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        width: "100%",
        minHeight: { xs: 48, md: 56 },
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 4 },
      }}
    >
      <Link to={`/weather/${type}`}>
        <Box
          component="img"
          src="/images/logo_form.png"
          alt=""
          sx={{
            width: "clamp(110px, 17.5vw, 220px)",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Link>
    </Box>
  );
}
