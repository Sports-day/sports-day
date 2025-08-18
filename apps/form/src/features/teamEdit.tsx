"use client";

import {
  Box,
  Grid,
  Card,
  TextField,
  Stack,
  Button,
  Skeleton,
} from "@mui/material";
import MembersCard from "@/components/cards/AboutTeamEditPage/memberscard";
import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type studentInformation = {
  studentId: string;
  studentName: string;
};

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

const GET_SPORTSCENE = gql`
  query GetSportscene {
    sportScenes {
      id
      sport {
        id
      }
      scene {
        id
      }
      entries {
        team {
          users {
            id
            name
          }
        }
      }
    }
  }
`;

const GET_TEAM_COUNT = gql`
  query SportScene($sportSceneId: ID!) {
    sportScene(id: $sportSceneId) {
      entries {
        team {
          id
        }
      }
    }
  }
`;

const GET_TEAM = gql`
  query SportScenes($teamId: ID!) {
    team(id: $teamId) {
      users {
        id
        name
      }
    }
  }
`;

const CREATE_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
    }
  }
`;
const ADD_TEAM_MEMBER = gql`
  mutation AddTeamMember($userIds: [ID!]!, $teamId: ID!) {
    addTeamMember(userIds: $userIds, teamId: $teamId) {
      id
    }
  }
`;
const CREATE_SPORT_ENTRY = gql`
  mutation CreateSportEntry($input: CreateSportEntryInput!) {
    createSportEntry(input: $input) {
      id
    }
  }
`;

const DELETE_MEMBER = gql`
  mutation DeleteMember($teamId: ID!, $userIds: [ID!]!) {
    removeTeamMember(teamId: $teamId, userIds: $userIds) {
      id
    }
  }
`;

export default function TeamEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };

  const [selectedMember, setSelectedMember] = useState<studentInformation[]>(
    []
  );
  const [searchName, setSearchName] = useState("");
  const router = useRouter();

  const { data: UserData, loading } = useQuery(GET_USERS);
  const { data: Ids } = useQuery(GET_SPORTSCENE);

  const searchParams = useSearchParams();
  const teams = searchParams?.get("teamid");
  const { data: TeamData } = useQuery(GET_TEAM, {
    variables: { teamId: teams },
  });

  const sportSceneId = useMemo(() => {
    return Ids?.sportScenes?.find(
      (d) => d.sport.id === sports && d.scene.id === type
    );
  }, [Ids, sports, type]);
  const { data: teamdata } = useQuery(GET_TEAM_COUNT, {
    variables: { sportSceneId: sportSceneId?.id },
    skip: !sportSceneId?.id,
  });

  const sportSceneMember = Ids?.sportScenes?.filter(
    (d) => d.scene?.id === type
  );

  const selectedIds = selectedMember.map((s) => s.studentId);
  const Teams = teamdata?.sportScene.entries.map((d) => d.team);
  const TeamCount = Teams?.length ?? 0;
  const Filtered_User = useMemo(() => {
    if (!UserData?.users) return [];
    return UserData.users.filter((u) => {
      if (searchName === "") return true;
      return u.name.includes(searchName);
    });
  }, [UserData?.users, searchName]);

  const myTeamUserIds = useMemo(() => {
    return TeamData?.team?.users?.map((u) => u.id) ?? [];
  }, [TeamData]);
  const AlreadyInAnyTeam = useMemo(() => {
    if (!sportSceneMember) return [];
    const all = sportSceneMember.flatMap((d) =>
      d.entries?.flatMap((s) => s.team?.users ?? [])
    );
    return all.filter((user) => !myTeamUserIds.includes(user.id));
  }, [sportSceneMember, myTeamUserIds]);

  useEffect(() => {
    if (TeamData?.team?.users) {
      const members = TeamData?.team?.users.map((t) => ({
        studentId: t.id,
        studentName: t.name,
      }));
      setSelectedMember(members);
    }
  }, [TeamData]);

  const [AddTeamMember] = useMutation(ADD_TEAM_MEMBER);
  const [CreateSportEntry] = useMutation(CREATE_SPORT_ENTRY);
  const [createTeam] = useMutation(CREATE_TEAM);
  const [DeleteMember] = useMutation(DELETE_MEMBER);

  const handleClick = (student: studentInformation) => {
    setSelectedMember((prev) => {
      if (prev.some((s) => s.studentId === student.studentId)) {
        return prev;
      } else {
        return [...prev, student];
      }
    });
  };

  const handleCreateTeam = async () => {
    const { data } = await createTeam({
      variables: {
        input: {
          name: `チーム${TeamCount + 1}`,
        },
      },
    });
    const team_id = data?.createTeam?.id;
    return team_id;
  };

  const handleAddTeamMember = async (teamid: string, members: string[]) => {
    await AddTeamMember({
      variables: {
        teamId: teamid,
        userIds: members,
      },
    });
  };
  const handleEntryTeam = async (teamId: string, sportsceneId: string) => {
    await CreateSportEntry({
      variables: {
        input: {
          teamId: teamId,
          sportSceneId: sportsceneId,
        },
      },
    });
  };

  const removeStudent = async (studentId: string) => {
    if (teams) {
      setSelectedMember((prev) =>
        prev.filter((s) => s.studentId !== studentId)
      );
      await DeleteMember({
        variables: {
          teamId: teams,
          userIds: [studentId],
        },
      });
    } else {
      setSelectedMember((prev) =>
        prev.filter((s) => s.studentId !== studentId)
      );
    }
  };

  return (
    <Box
      sx={{
        m: "3vh",
        pt: "3%",
        height: "65vh",
        background: "#F4F5F9",
        borderRadius: "10px",
        display: "flex",
        px: "6%",
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={6} md={4} lg={4} xl={3} sx={{ height: "100%" }}>
          <Stack sx={{ width: "100%", height: "100%" }}>
            <Typography sx={{ color: "#5F6DC2" }}>
              メンバーを選択してください
            </Typography>
            <Card
              variant="outlined"
              sx={{
                borderColor: "#5B6DC6",
                borderWidth: "2px",
                borderStyle: "solid",
                borderRadius: "10px",
                height: "100%",
                background: "none",
                display: "flex",
                flexDirection: "column",
                mt: "1%",
              }}
            >
              <Stack
                direction="column"
                flexWrap="nowrap"
                spacing={2}
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  p: "3%",

                  minHeight: 0,
                }}
              >
                {selectedMember?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ color: "#FF0000" }}>
                      ※学籍番号をタッチして
                      <br />
                      メンバーを追加してください
                    </Typography>
                  </Box>
                ) : (
                  selectedMember.map((student, index) => (
                    <Box key={index} sx={{ height: "20%" }}>
                      <MembersCard
                        studentname={student.studentName}
                        fixed={true}
                        remove={() => {
                          removeStudent(student.studentId);
                        }}
                      />
                    </Box>
                  ))
                )}
              </Stack>
              <Box
                sx={{
                  background: "#5F6DC2",

                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{
                      background: "#7F8CD6",
                      color: "white",
                      width: "60%",
                      my: "1vh",
                      "&:hover": {
                        opacity: 0.8,
                        background: "#7F8CD6",
                      },
                    }}
                    variant="contained"
                    onClick={async () => {
                      if (teams) {
                        await handleAddTeamMember(teams, selectedIds);
                      } else {
                        const newTeamId = await handleCreateTeam();
                        await handleAddTeamMember(newTeamId, selectedIds);
                        await handleEntryTeam(newTeamId, sportSceneId?.id);
                      }
                      router.back();
                    }}
                  >
                    登録
                  </Button>
                </motion.div>
              </Box>
            </Card>
          </Stack>
        </Grid>
        <Grid item md={8} lg={8} sx={{ height: "100%" }}>
          <Card
            variant="outlined"
            sx={{
              borderColor: "#5B6DC6",
              borderWidth: "2px",
              borderStyle: "solid",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
              pb: "3%",
              p: "1%",
              height: "100%",
              width: "100%",
              background: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              overflowY: "auto",
              flexGrow: 1,
            }}
          >
            <Stack
              sx={{
                width: "80%",
                height: "100%",
              }}
            >
              <TextField
                id="outlined-basic"
                label="...検索"
                variant="outlined"
                sx={{
                  borderColor: "#91A3FF",
                  background: "#F0F4FF",
                  color: "#808080",
                  borderRadius: "10px",
                  my: "3%",
                }}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Grid container spacing={2}>
                {loading
                  ? Array.from({ length: 30 }).map((_, index) => (
                      <Grid key={index} item md={6} lg={6} xl={6}>
                        <Skeleton
                          variant="ractangular"
                          animation="wave"
                          height={40}
                          sx={{ borderRadius: "10px" }}
                        />
                      </Grid>
                    ))
                  : Filtered_User?.map((item, index) => (
                      <Grid key={item.id} item md={6} lg={6} xl={6}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.02,
                          }}
                        >
                          <MembersCard
                            studentid={item.id}
                            studentname={item.name}
                            addstudent={() =>
                              handleClick({
                                studentId: String(item.id),
                                studentName: item.name,
                              })
                            }
                            disable={selectedIds.includes(String(item.id))}
                            isInclude={
                              AlreadyInAnyTeam.some(
                                (a) => a.id === String(item.id)
                              ) || selectedIds.includes(String(item.id))
                            }
                            remove={() => removeStudent(String(item.id))}
                          />
                        </motion.div>
                      </Grid>
                    ))}
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
