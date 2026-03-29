"use client";

import { Card, Box, Typography, Grid, Stack, useTheme } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

type sceneInformation = {
  scenename: string;
  nonselected: { id: string; name: string }[];
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
            id
          }
        }
      }
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
    }
  }
`;

export default function NotSelected() {
  const theme = useTheme();
  const { data: Scene } = useQuery(GET_SCENE_ID);
  const { data: SceneData } = useQuery(GET_SCENE_USERS);
  const { data: AllUser } = useQuery(GET_ALL_USERS);

  const Data1 =
    SceneData?.sportScenes?.filter(
      (e: any) => e.scene?.id === Scene?.scenes[0]?.id,
    ) || [];
  const Data2 =
    SceneData?.sportScenes?.filter(
      (e: any) => e.scene?.id === Scene?.scenes[1]?.id,
    ) || [];

  const Scenename1 = Scene?.scenes[0]?.name;
  const Scenename2 = Scene?.scenes[1]?.name;

  const SceneTeamUser1 = Data1?.flatMap((d: any) =>
    d.entries?.flatMap((s: any) => s.team?.users?.map((u: any) => u.id) || []),
  );
  const SceneTeamUser2 = Data2?.flatMap((d: any) =>
    d.entries?.flatMap((s: any) => s.team?.users?.map((u: any) => u.id) || []),
  );

  const AllUsers =
    AllUser?.users?.map((d: any) => ({
      id: d.id?.trim(),
      name: d.name?.trim(),
    })) || [];

  const nonSelectedUser1 = AllUsers?.filter(
    (user: { id: string; name: string }) =>
      !(SceneTeamUser1 ?? []).includes(user.id),
  );

  const nonSelectedUser2 = AllUsers?.filter(
    (user: { id: string; name: string }) =>
      !(SceneTeamUser2 ?? []).includes(user.id),
  );

  const AllSceneData: sceneInformation[] = [
    {
      scenename: Scenename1,
      nonselected: nonSelectedUser1,
    },
    {
      scenename: Scenename2,
      nonselected: nonSelectedUser2,
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: theme.palette.card.main,
        borderRadius: "10px",
        background: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          p: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography sx={{ color: "#E34013" }}>未登録</Typography>
        <Box
          sx={{
            background: "none",
            width: "100%",
            height: "100%",
          }}
        >
          {AllSceneData?.map((item, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                borderColor: theme.palette.card.main,
                background: "none",
                m: "16px",
                p: "16px",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={"16px"}
                sx={{ mb: "16px", width: "100%" }}
              >
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.buttonFont2,
                    flexGrow: 1,
                  })}
                >
                  {item.scenename}
                </Typography>
              </Stack>
              {item.nonselected?.length === 0 ? (
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
                <Grid container spacing={"8px"}>
                  {item.nonselected?.map((user, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card
                        sx={{
                          background: theme.palette.card.main,
                          borderRadius: "15px",
                          color: "white",
                          width: "100%",
                          minHeight: 40,
                          px: "8px",
                          py: "8px",
                          m: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            color: "inherit",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {user.name}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Card>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
