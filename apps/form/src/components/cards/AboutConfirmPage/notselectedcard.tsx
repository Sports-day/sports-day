"use client";

import { Card, Box, Typography, Grid, Stack } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

type sceneInformation = {
  scenename: string;
  nonselected: string[];
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
  const { data: Scene } = useQuery(GET_SCENE_ID);
  const { data: SceneData } = useQuery(GET_SCENE_USERS);
  const { data: AllUser } = useQuery(GET_ALL_USERS);

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

  const SceneTeamUser1 = Data1?.flatMap((d) =>
    d.entries?.flatMap((s) => s.team?.users?.map((u) => u.id) || [])
  );
  const SceneTeamUser2 = Data2?.flatMap((d) =>
    d.entries?.flatMap((s) => s.team?.users?.map((u) => u.id) || [])
  );

  const AllUsers =
    AllUser?.users?.map((d) => ({
      id: d.id?.trim(),
      name: d.name?.trim(),
    })) || [];

  const nonSelectedUser1 = AllUsers?.filter(
    (user) => !SceneTeamUser1.includes(user.id)
  );
  console.log(nonSelectedUser1);

  const nonSelectedUser2 = AllUsers?.filter(
    (user) => !SceneTeamUser2.includes(user.id)
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
  console.log(AllSceneData);

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
          p: "3%",
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
          <Typography sx={{ color: "#E34013" }}>未登録</Typography>
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

              p: "3%",
            }}
          >
            <Typography>{item.scenename}</Typography>
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
              <Grid
                container
                sx={{
                  overscrollBehavior: "contain",
                  maxHeight: "114px",
                  overflowY: "auto",
                }}
              >
                {item.nonselected?.map((user, index) => (
                  <Grid item lg={3} xl={3} key={index}>
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
                      {user.name}
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
