"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { MemberData } from "@/Data/MemberData";
import MembersCard from "@/components/cards/memberscard";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import Button from "@mui/material/Button";
import { gql, useMutation } from "@apollo/client";

const ADD_TEAM = gql`
  mutation AddTeam($teamname: String!, $studentids: [MemberInput!]!) {
    addTeam(teamname: $teamname, member: $studentids) {
      teamname
      member {
        studentids
      }
    }
  }
`;

export default function TeamEdit() {
  const [addTeam] = useMutation(ADD_TEAM);
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const handleAddTeam = async () => {
    await addTeam({
      variables: {
        teamname: "team1",
        member: selectedMember.map((id) => ({ studentids: id })),
      },
    });
  };
  const handleClick = (studentid: string) => {
    setSelectedMember((prev) => {
      if (prev.includes(studentid)) {
        return prev;
      } else {
        return [...prev, studentid];
      }
    });
  };
  return (
    <Box
      sx={{
        m: "3vh",
        p: "3vh",
        height: "65vh",
        background: "#F4F5F9",
        borderRadius: "10px",
        display: "flex",
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid xs={6} md={4} lg={4} xl={3} sx={{ height: "100%" }}>
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
            }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1, overflow: "auto" }}>
              {selectedMember.map((studentid, index) => (
                <MembersCard key={index} studentid={studentid} fixed={true} />
              ))}
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
              <Button
                sx={{
                  background: "#7F8CD6",
                  color: "white",
                  width: "80%",
                  my: "1vh",
                }}
                variant="contained"
                onClick={handleAddTeam}
              >
                登録
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid md={8} lg={8} sx={{ height: "100%" }}>
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
            }}
          >
            <Stack spacing={2} sx={{ overflow: "auto", flexGrow: 1 }}>
              <TextField label="🔎学籍番号を検索" variant="filled" />
              <Grid container spacing={2}>
                {MemberData.map((item, index) => (
                  <Grid key={index} md={6} lg={6} xl={6}>
                    <MembersCard
                      studentid={item.studentid}
                      addstudent={handleClick}
                    />
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
