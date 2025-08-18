"use client";

import { Card, Box, Typography, Grid, Stack } from "@mui/material";
import EditButton from "../../buttons/editbutton";

type AllDataProps = {
  scenename: string;
  sceneid: string;
  sportname: string;
  sportid: string;
  teamname: string[];
  teamid: string[];
  memberdata: [][];
};

export default function ConfirmCard({
  scenename,
  sceneid,
  sportname,
  sportid,
  teamname,
  teamid,
  memberdata,
}: AllDataProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        background: "none",
        borderColor: "#5B6DC6",
        borderRadius: "10px",

        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          p: "3%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography>
          {scenename}
          {sportname}
        </Typography>
        <Box
          sx={{
            background: "none",
            width: "100%",
            height: "100%",
          }}
        >
          {teamname.length === 0 ? (
            <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
              <Typography sx={{ color: "#E34013" }}>
                チームは登録されていません
              </Typography>
            </Stack>
          ) : (
            teamname
              .slice()
              .reverse()
              .map((team, index) => (
                <Card
                  variant="outlined"
                  key={team}
                  sx={{
                    borderColor: "#5B6DC6",
                    background: "none",
                    m: "3%",
                    p: "3%",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: "1%" }}
                  >
                    <Typography sx={{ color: "#5B6DC6" }}>{team}</Typography>
                    <EditButton
                      type={sceneid}
                      sports={sportid}
                      teams={teamid[index]}
                    />
                  </Stack>
                  <Grid container>
                    {memberdata[index]
                      ?.slice()
                      .reverse()
                      .map((member, idx) => (
                        <Grid item lg={3} key={idx}>
                          <Card
                            sx={{
                              background: "#5B6DC6",
                              borderRadius: "15px",
                              color: "white",
                              p: "3%",
                              m: "2%",

                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {member}
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Card>
              ))
          )}
        </Box>
      </Box>
    </Card>
  );
}
