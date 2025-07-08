import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Warning from "@/components/other/warningcomment";
import { TeamManageData } from "@/Data/TeamManagedata";
import ConfirmCard from "@/components/cards/confirmcard";

export default function ConfirmPage() {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      display="flex"
      alignItems="center"
      sx={{ height: "100%" }}
    >
      <Grid xs={12} md={6} lg={6} xl={4}>
        <Warning warncomment="全員が正しくチームに登録されているかを確認してください"></Warning>
      </Grid>
      <Box
        sx={{ width: "100%", height: "100%", flexGrow: 1, overflow: "auto" }}
      >
        <Box sx={{ background: "#F4F5F9", m: "1%" }}>
          <Grid container spacing={2}>
            {TeamManageData.map((team, index) => (
              <Grid key={index} xs={12} md={6} lg={6} xl={4} flexGrow={1}>
                <ConfirmCard
                  teamname={team.teamname}
                  teammember={team.teammember}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
}
