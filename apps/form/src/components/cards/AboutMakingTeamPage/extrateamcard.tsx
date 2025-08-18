import { Card, Typography, Stack, CardActionArea } from "@mui/material";
import Link from "next/link";

export type informationProps = {
  sports: string;
  type: string;
};

export default function ExtraTeamCard({ sports, type }: informationProps) {
  return (
    <Link href={`/weather/${type}/sport/${sports}/team/makenewteam`} passHref>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          borderRadius: "10px",
          background: "#F4F5F9",
          boerderColor: "#5B6DC6",
          borderWidth: "2px",
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
              height: "50vh",
            }}
          >
            <Typography>+チームを追加</Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </Link>
  );
}
