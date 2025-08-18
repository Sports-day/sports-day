"use client";

import { Box, Grid, Skeleton } from "@mui/material";
import ConfirmCard from "@/components/cards/AboutConfirmPage/confirmcard";
import Confricted from "@/components/cards/AboutConfirmPage/confrictedcard";
import NotSelected from "@/components/cards/AboutConfirmPage/notselectedcard";
import { motion } from "framer-motion";
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
  const { data, loading } = useQuery(GET_ALLTEAMDATA);

  const allData = data?.sportScenes?.map((d) => ({
    sceneName: d.scene?.name,
    sceneId: d.scene?.id,
    sportName: d.sport?.name,
    sportId: d.sport?.id,
    teamName: d.entries?.map((s) => s.team?.name),
    teamId: d.entries?.map((s) => s.team?.id),
    memberData: d.entries?.map((s) => s.team?.users?.map((u) => u.name)),
  }));

  return (
    <Box
      sx={{
        background: "#F4F5F9",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        borderRadius: "10px",
      }}
    >
      {loading ? (
        <Grid container spacing={3} sx={{ p: "3%" }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} item md={6} lg={6} xl={6}>
              <Skeleton
                variant="ractangular"
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
          spacing={3}
          justifyContent="center"
          direction="row"
          sx={{
            width: "100%",
            height: "100%",
            p: "3vh",
          }}
        >
          <Grid item lg={6}>
            <NotSelected />
          </Grid>
          <Grid item lg={6}>
            <Confricted />
          </Grid>

          {allData?.map((item, index) => (
            <Grid key={index} item xs={12} md={6} lg={6} xl={4} flexGrow={1}>
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
