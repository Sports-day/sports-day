import {
  Card,
  Typography,
  Stack,
  CardActionArea,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

export type informationProps = {
  sports: string;
  type: string;
};

export default function ExtraTeamCard({ sports, type }: informationProps) {
  const theme = useTheme();
  return (
    <Link
      to={`/weather/${type}/sport/${sports}/team/makenewteam`}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <Card
        variant="outlined"
        sx={{
          height: "clamp(260px, 40vw, 420px)",
          borderRadius: "10px",
          background: theme.palette.card.light,
          borderColor: theme.palette.card.main,
          borderWidth: "1px",
          component: "div",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardActionArea sx={{ height: "100%" }}>
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              px: "8px",
            }}
          >
            <Typography
              sx={{ color: "#808080", fontSize: "20px", fontWeight: "medium" }}
            >
              +チームを追加
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </Link>
  );
}
