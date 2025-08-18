"use client";

import { Typography, Box, Grid, Stack } from "@mui/material";
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
  const { data, loading } = useQuery(GET_SCENE_SPORT);
  const teams = data?.sportScenes?.filter(
    (d) => d.sport.id === sports && d.scene.id === type
  );

  if (loading) {
    <CircularUnderLoad />;
  }

  const selectedTeams = teams?.flatMap((d) => d.entries.map((s) => s.team));

  return (
    <Stack sx={{ height: "80vh", overflow: "hidden" }}>
      <Box
        sx={{
          flex: "0 0 auto",
          p: "1%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Instruction sportname={sportname} weather={weather} />
      </Box>

      <Box
        sx={{
          flex: 1,
          m: "1%",
          p: "1%",
          px: "3%",
          background: "#e1e4f6",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Typography sx={{ color: "#2F3C8C", mb: 1 }}>
          作成したチーム一覧
        </Typography>
        <motion.div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
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
            justifyContent="center"
          >
            {selectedTeams
              ?.slice()
              .reverse()
              .map((item) => (
                <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TeamCard
                    teamid={item.id}
                    teamname={item?.name}
                    type={type}
                    sports={sports}
                    member={item?.users.map((n) => ({ name: n.name }))}
                  />
                </Grid>
              ))}
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <ExtraTeamCard sports={sports} type={type} />
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </Stack>
  );
}
