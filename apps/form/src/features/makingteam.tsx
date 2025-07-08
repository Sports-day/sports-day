import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ExtraTeamCard from "@/components/cards/extrateamcard";
import TeamCard from "@/components/cards/teamcard";
import { TeamManageData } from "@/Data/TeamManagedata";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function MakingTeams(sports: { sports: string }) {
  return (
    <Stack sx={{ height: "65vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: "1%",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Typography variant="h3">晴天</Typography>
          <Image src="/basketball.png" alt="" width="50" height="50" />
          <Typography variant="h3">バスケットボール</Typography>
        </Stack>
      </Box>
      <Box
        sx={{
          m: "1vh",
          p: "1vh",
          height: "100%",
          background: "#F4F5F9",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ color: "#5F6DC2" }}>作成したチーム一覧</Typography>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ flexGrow: 1, overflow: "auto" }}
        >
          <Grid xs={4} md={3} lg={3} xl={2}>
            <ExtraTeamCard sportid={sports} />
          </Grid>
          {TeamManageData.map((item, index) => (
            <Grid key={index} xs={4} md={3} lg={3} xl={2}>
              <TeamCard teamname={item.teamname} teammember={item.teammember} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
