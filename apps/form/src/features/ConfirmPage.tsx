"use client";

import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import ConfirmCard from "@/components/cards/AboutConfirmPage/ConfirmCard";
import Conflicted from "@/components/cards/AboutConfirmPage/ConflictedCard";
import NotSelected from "@/components/cards/AboutConfirmPage/NotSelectedCard";
import CircularUnderLoad from "@/features/Loading";
import { useGetAllTeamdataQuery } from "@/gql/__generated__/graphql";

export default function ConfirmPage() {
  const theme = useTheme();
  const { data, loading } = useGetAllTeamdataQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const allData = data?.scenes
    ?.filter((s) => !s.isDeleted)
    ?.flatMap((s) => s.sportScenes)
    ?.map((d) => ({
      sceneName: d.scene?.name,
      sceneId: d.scene?.id,
      sportName: d.sport?.name,
      sportId: d.sport?.id,
      teamName: d.entries?.map((s) => s.team?.name),
      teamId: d.entries?.map((s) => s.team?.id),
      memberData: d.entries?.map((s) =>
        s.team?.users?.map((u) => u.name),
      ),
    }));

  if (loading) {
    return <CircularUnderLoad />;
  }

  return (
    <Box
      sx={{
        background: theme.palette.card.light,
        width: "100%",
        height: "100%",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        borderRadius: "10px",
      }}
    >
      <Grid
        container
        spacing={"32px"}
        justifyContent="center"
        direction="row"
        sx={{
          width: "100%",
          height: "100%",
          px: "32px",
          py: "16px",
          overflowY: "auto",
          alignContent: "flex-start",
        }}
      >
        <Grid size={{ xs: 12, md: 6, lg: 6, xl: 6 }}>
          <NotSelected />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 6, xl: 6 }}>
          <Conflicted />
        </Grid>

        {allData?.map((item, index) => (
          <Grid
            key={index}
            size={{ xs: 12, md: 6, lg: 6, xl: 6 }}
            flexGrow={1}
          >
            <ConfirmCard
              scenename={item.sceneName}
              sceneid={item.sceneId}
              sportname={item.sportName}
              sportid={item.sportId}
              teamname={item.teamName}
              teamid={item.teamId}
              memberdata={item.memberData}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
