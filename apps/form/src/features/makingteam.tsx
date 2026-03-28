"use client";

import { Typography, Box, Grid, Stack, useTheme } from "@mui/material";
import ExtraTeamCard from "@/components/cards/AboutMakingTeamPage/extrateamcard";
import TeamCard from "@/components/cards/AboutMakingTeamPage/teamcard";
import Instruction from "@/components/cards/AboutAnyPage/instructioncard";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import CircularUnderLoad from "./loading";

type MakingProps = {
  sports: string;
  type: string;
  sportname: string;
  weather: string;
};

const GET_SCENE_SPORT = gql`
  query GetSceneSport {
    sportScenes {
      id
      entries {
        team {
          id
          name
          users {
            name
          }
        }
      }
      sport {
        id
      }
      scene {
        id
      }
    }
  }
`;

export default function MakingTeams({
  sports,
  type,
  sportname,
  weather,
}: MakingProps) {
  const theme = useTheme();
  const { data, loading } = useQuery(GET_SCENE_SPORT);
  const teams =
    data?.sportScenes?.filter(
      (d: any) => d.sport.id === sports && d.scene.id === type,
    ) ?? [];

  if (loading) {
    return <CircularUnderLoad />;
  }

  const selectedTeams = teams.flatMap((d: any) =>
    d.entries.map((s: any) => s.team),
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "auto", md: "calc(100dvh - 210px)" },
      }}
    >
      <Stack sx={{ height: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            flex: "0 0 auto",
            my: theme.spacing(1),
            width: "100%",
            display: "flex",
            justifyContent: "left",
          }}
        >
          <Instruction sportname={sportname} weather={weather} />
        </Box>

        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 4 },
            py: theme.spacing(1),
            background: theme.palette.card.light,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.buttonFont2,
            })}
          >
            作成したチーム一覧
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="flex-start"
                justifyContent="left"
              >
                {selectedTeams
                  ?.slice()
                  .reverse()
                  .map((item: any) => (
                    <Grid
                      key={item.id}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                    >
                      <TeamCard
                        teamid={item.id}
                        teamname={item.name}
                        type={type}
                        sports={sports}
                        member={item.users.map((n: any) => ({ name: n.name }))}
                      />
                    </Grid>
                  ))}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <ExtraTeamCard sports={sports} type={type} />
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
