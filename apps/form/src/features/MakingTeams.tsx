"use client";

import { Typography, Box, Stack, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import ExtraTeamCard from "@/components/cards/AboutMakingTeamPage/ExtraTeamCard";
import TeamCard from "@/components/cards/AboutMakingTeamPage/TeamCard";
import Instruction from "@/components/cards/AboutAnyPage/InstructionCard";
import AppBreadcrumbs, {
  type BreadcrumbItem,
} from "@/components/layouts/AppBreadcrumbs";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import CircularUnderLoad from "./Loading";

type MakingProps = {
  sports: string;
  type: string;
  sportname: string;
  weather: string;
};

const GET_SCENE_SPORT = gql`
  query GetSceneSport {
    scenes {
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
    data?.scenes
      ?.flatMap((s: any) => s.sportScenes)
      ?.filter((d: any) => d.sport.id === sports && d.scene.id === type) ?? [];
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "ホーム", href: `/weather/${type}` },
    { label: "チーム確認" },
  ];

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
        height: "100%",
        minHeight: { xs: "auto", md: "calc(100dvh - 210px)" },
      }}
    >
      <Stack sx={{ height: "100%", overflow: "hidden" }}>
        <Box>
          <AppBreadcrumbs items={breadcrumbs} />
        </Box>
        <Box
          sx={{
            flex: "0 0 auto",
            my: "8px",
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
            minHeight: { xs: 320, md: 420 },
            maxHeight: { xs: "none", md: "calc(100dvh - 320px)" },
            px: "32px",
            pt: "16px",
            pb: "32px",
            background: theme.palette.card.light,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.buttonFont2,
              mb: "16px",
            })}
          >
            作成したチーム一覧
          </Typography>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
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
                spacing={"16px"}
                alignItems="flex-start"
                justifyContent="left"
              >
                {selectedTeams
                  ?.slice()
                  .reverse()
                  .map((item: any) => (
                    <Grid
                      key={item.id}
                      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
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
