"use client";

import { Grid, Box } from "@mui/material";
import SportCard from "@/components/cards/AboutSportPage/sportcard";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";

type WeatherData = { name: string; id: string };

type Props = {
  weather: WeatherData[];
  type: string;
};

const GET_TEAMDATA = gql`
  query GetTeamData {
    sportScenes {
      sport {
        id
      }
      scene {
        id
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

export default function SportCards({ weather, type }: Props) {
  const { data } = useQuery(GET_TEAMDATA);

  const hasTeamMap = new Map<string, boolean>();

  weather.forEach((item) => {
    const entry = data?.sportScenes?.find(
      (d) => d.sport?.id === item.id && d.scene?.id === type
    );
    const users = entry?.entries?.flatMap((s) => s.team?.users ?? []) ?? [];
    hasTeamMap.set(item.id, users.length > 0);
  });

  return (
    <Box
      sx={{
        height: "55vh",
        background: "#e1e4f6",
        borderRadius: "10px",
        m: "1%",
        p: "3%",
        display: "flex",
        flexDirection: "clumn",
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      <Grid container spacing={2}>
        {weather.map((item, index) => (
          <Grid item xs={6} md={4} lg={4} xl={3} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <SportCard
                name={item.name}
                sportId={item.id}
                type={type}
                hasTeam={hasTeamMap.get(item.id) ?? false}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
