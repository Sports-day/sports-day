"use client";

import { Card, Box, Typography, Grid, Stack, Button } from "@mui/material";
import EditButton from "../../buttons/editbutton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckPopup_Confirm from "@/components/popups/checkpopup-comfirmpage";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
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
          p: 2,
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
                    m: 2,
                    p: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography sx={{ color: "#5B6DC6" }}>{team}</Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <EditButton
                        type={sceneid}
                        sports={sportid}
                        teams={teamid[index]}
                      />
                      <Button
                        component="span"
                        variant="contained"
                        sx={{
                          borderWidth: "2px",
                          borderColor: "#E34013",
                          background: "white",
                          color: "#E34013",
                          "&:hover": {
                            borderWidth: "2px",
                            borderColor: "#E34013",
                            background: "white",
                            color: "#E34013",
                            background: "white",
                            opacity: 0.8,
                          },
                        }}
                        onClick={handleOpen}
                      >
                        <DeleteIcon />
                        削除
                      </Button>
                      <CheckPopup_Confirm
                        teamid={teamid[index]}
                        open={open}
                        setOpen={setOpen}
                      />
                    </Stack>
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
