"use client";

import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import ConfirmCard from "@/components/cards/AboutConfirmPage/ConfirmCard";
import Conflicted from "@/components/cards/AboutConfirmPage/ConflictedCard";
import NotSelected from "@/components/cards/AboutConfirmPage/NotSelectedCard";
import { gql, useQuery } from "@apollo/client";
import CircularUnderLoad from "@/features/Loading";

const GET_ALLTEAMDATA = gql`
  query GetAllTeamdata {
    scenes {
      sportScenes {
        scene {
          id
          name
        }
        sport {
          id
          name
        }
        entries {
          team {
            id
            name
            users {
              name
            }
          }
        }
      }
    }
  }
`;

export default function ConfirmPage() {
  const theme = useTheme();
  const { data, loading } = useQuery(GET_ALLTEAMDATA, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const allData:
    | {
        sceneName: string;
        sceneId: string;
        sportName: string;
        sportId: string;
        teamName: string[];
        teamId: string[];
        memberData: string[][];
      }[]
    | undefined = data?.scenes
    ?.flatMap((s: any) => s.sportScenes)
    ?.map((d: any) => ({
      sceneName: d.scene?.name,
      sceneId: d.scene?.id,
      sportName: d.sport?.name,
      sportId: d.sport?.id,
      teamName: d.entries?.map((s: any) => s.team?.name),
      teamId: d.entries?.map((s: any) => s.team?.id),
      memberData: d.entries?.map((s: any) =>
        s.team?.users?.map((u: any) => u.name),
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
