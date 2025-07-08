import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";

export default function ExtraTeamCard({
  sports,
}: {
  sports: string | undefined;
}) {
  return (
    <Link href={`weather//sport/${sports}/teams/makenewteam`} passHref>
      <Card
        variant="outlined"
        sx={{
          height: "50vh",
          borderRadius: "10px",
          background: "#F4F5F9",
          boerderColor: "#5B6DC6",
          borderWidth: "2px",
          component: "div",
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
