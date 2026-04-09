"use client";

import { Card, Box, Typography, Stack, Button, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import EditButton from "../../buttons/EditButton";
import CheckPopup_Confirm from "@/components/popups/CheckPopupConfirmPage";
import { useState } from "react";

type MemberInfo = {
  name: string;
  isExperienced: boolean;
};

type AllDataProps = {
  scenename: string;
  sceneid: string;
  sportname: string;
  sportid: string;
  teamname: string[];
  teamid: string[];
  memberdata: MemberInfo[][];
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
  const theme = useTheme();
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);

  const teamRows = teamname
    .map((name, index) => ({
      teamName: name,
      teamId: teamid[index],
      members: memberdata[index] ?? [],
    }))
    .reverse();

  return (
    <Card
      variant="outlined"
      component="fieldset"
      sx={{
        background: "none",
        border: "1px solid",
        borderColor: theme.palette.card.main,
        borderRadius: "10px",
        m: 0,

        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        component="legend"
        sx={(theme) => ({
          ...theme.typography.buttonFont3,
          flexGrow: 1,
          ml: "4px",
        })}
      >
        {scenename}
        {sportname}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          px: "16px",
          py: "16px",

          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            background: "none",
            width: "100%",
            height: "100%",
          }}
        >
          {teamname.length === 0 ? (
            <Stack
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#FF0000" }}>
                チームは登録されていません
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={"16px"}>
              {teamRows.map((row) => (
                <Card
                  variant="outlined"
                  key={row.teamId ?? row.teamName}
                  sx={{
                    border: "1px solid",
                    borderColor: theme.palette.card.main,
                    background: "none",
                    p: "16px",
                    borderRadius: "10px",
                    m: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: "8px",
                    }}
                  >
                    <Typography
                      sx={(theme) => ({
                        ...theme.typography.buttonFont2,
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      })}
                    >
                      {row.teamName}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <EditButton
                        type={sceneid}
                        sports={sportid}
                        teams={row.teamId}
                      />
                      <Button
                        component="span"
                        variant="outlined"
                        sx={{
                          borderWidth: "2px",
                          borderColor: "#E4781A",
                          background: "white",
                          color: "#E4781A",
                          borderRadius: "10px",
                          p: "4px",
                          width: "auto",
                          "&:hover": {
                            borderWidth: "2px",
                            borderColor: "#E4781A",
                            background: "white",
                            color: "#E4781A",
                            borderRadius: "10px",
                            p: "4px",
                            width: "auto",
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => setOpenTeamId(row.teamId)}
                      >
                        削除
                      </Button>
                      <CheckPopup_Confirm
                        teamid={row.teamId}
                        open={openTeamId === row.teamId}
                        setOpen={(open) => {
                          if (!open) {
                            setOpenTeamId(null);
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                  <Grid container spacing={"8px"}>
                    {row.members
                      ?.slice()
                      .reverse()
                      .map((member, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                          <Card
                            sx={{
                              background: theme.palette.card.main,
                              borderRadius: "15px",
                              color: "white",
                              width: "100%",
                              minHeight: 40,
                              p: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            {member.isExperienced && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "#FF9800",
                                }}
                              />
                            )}
                            <Typography
                              noWrap
                              sx={{
                                color: "inherit",
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              {member.name}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Card>
  );
}
