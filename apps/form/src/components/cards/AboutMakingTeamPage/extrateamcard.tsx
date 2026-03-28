"use client";

import {
  Card,
  Typography,
  Stack,
  CardActionArea,
  useTheme,
} from "@mui/material";
import Link from "next/link";

export type informationProps = {
  sports: string;
  type: string;
};

export default function ExtraTeamCard({ sports, type }: informationProps) {
  const theme = useTheme();
  return (
    <Link href={`/weather/${type}/sport/${sports}/team/makenewteam`} passHref>
      <Card
        variant="outlined"
        sx={{
          height: "55vh",
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
        <CardActionArea>
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "55vh",
            }}
          >
            <Typography
              sx={{ color: "#A49494", fontSize: "20px", fontWeight: "medium" }}
            >
              +チームを追加
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </Link>
  );
}
