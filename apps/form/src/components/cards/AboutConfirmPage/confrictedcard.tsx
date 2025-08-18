"use client";

import { Card, Box, Typography, Grid, Stack } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

type sceneInformation = {
  scenename: string;
  confricted: string[];
};

const GET_SCENE_ID = gql`
  query GetSceneId {
    scenes {
      id
      name
    }
  }
`;

const GET_SCENE_USERS = gql`
  query GetSceneUsers {
    sportScenes {
      scene {
        id
        name
      }
      entries {
        team {
          users {
            name
          }
        }
      }
    }
  }
`;

export default function Confricted() {
  const { data: Scene } = useQuery(GET_SCENE_ID);
  const { data: SceneData } = useQuery(GET_SCENE_USERS);

  const Data1 =
    SceneData?.sportScenes?.filter(
      (e) => e.scene?.id === Scene?.scenes[0]?.id
    ) || [];
  const Data2 =
    SceneData?.sportScenes?.filter(
      (e) => e.scene?.id === Scene?.scenes[1]?.id
    ) || [];

  const Scenename1 = Scene?.scenes[0]?.name;
  const Scenename2 = Scene?.scenes[1]?.name;

  const SceneTeamUser1 =
    Data1?.flatMap((d) =>
      d.entries?.flatMap((s) => s.team?.users?.map((u) => u.name))
    ) || [];
  const SceneTeamUser2 =
    Data2?.flatMap((d) =>
      d.entries?.flatMap((s) => s.team?.users?.map((u) => u.name))
    ) || [];

  const nameCount1: Record<string, number> = {};
  const nameCount2: Record<string, number> = {};
  SceneTeamUser1?.forEach((name) => {
    nameCount1[name] = (nameCount1[name] || 0) + 1;
  });
  SceneTeamUser2?.forEach((name) => {
    nameCount2[name] = (nameCount2[name] || 0) + 1;
  });
  const confrictedUser1 = Object?.keys(nameCount1).filter(
    (name) => nameCount1[name] > 1
  );
  const confrictedUser2 = Object?.keys(nameCount2).filter(
    (name) => nameCount2[name] > 1
  );

  const AllSceneData: sceneInformation[] = [
    {
      scenename: Scenename1,
      confricted: confrictedUser1,
    },
    {
      scenename: Scenename2,
      confricted: confrictedUser2,
    },
  ];

  return (
    <Box
      sx={{
        borderColor: "#5B6DC6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          borderColor: "#5B6DC6",
          borderRadius: "10px",
          borderWidth: "1px",
          background: "none",
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "#E34013" }}>重複</Typography>
        </Stack>
        {AllSceneData?.map((item, idx) => (
          <Card
            key={idx}
            variant="outlined"
            sx={{
              borderColor: "#5B6DC6",
              borderRadius: "10px",
              borderWidth: "1px",
              background: "none",
              m: "3%",
              p: "3%",
            }}
          >
            <Typography>{item.scenename}</Typography>
            {item.confricted?.length === 0 ? (
              <Stack
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>該当者はいません</Typography>
              </Stack>
            ) : (
              <Grid
                container
                sx={{
                  overscrollBehavior: "contain",
                  maxHeight: "114px",
                  overflowY: "auto",
                }}
              >
                {item.confricted?.map((user, index) => (
                  <Grid item lg={3} key={index}>
                    <Card
                      sx={{
                        background: "#5B6DC6",
                        borderRadius: "15px",
                        color: "white",
                        p: "3%",
                        m: "3%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {user}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        ))}
      </Card>
    </Box>
  );
}
