"use client";

import { Box, Skeleton, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import ConfirmCard from "@/components/cards/AboutConfirmPage/confirmcard";
import Confricted from "@/components/cards/AboutConfirmPage/confrictedcard";
import NotSelected from "@/components/cards/AboutConfirmPage/notselectedcard";
import { gql, useQuery } from "@apollo/client";

const GET_ALLTEAMDATA = gql`
  query GetAllTeamdata {
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
`;

export default function ConfirmPage() {
  const theme = useTheme();
  const { data, loading } = useQuery(GET_ALLTEAMDATA);

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
    | undefined = data?.sportScenes?.map((d: any) => ({
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
      {loading ? (
        <Grid
          container
          spacing={"32px"}
          sx={{ width: "100%", height: "100%", p: "32px", overflowY: "auto", alignContent: "flex-start" }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 6, lg: 6, xl: 6 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="100%"
                height={240}
                sx={{ borderRadius: "10px" }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          spacing={"32px"}
          justifyContent="center"
          direction="row"
          sx={{
            width: "100%",
            height: "100%",
            p: "32px",
            overflowY: "auto",
            alignContent: "flex-start",
          }}
        >
          <Grid size={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
            <NotSelected />
          </Grid>
          <Grid size={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
            <Confricted />
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
      )}
    </Box>
  );
}
