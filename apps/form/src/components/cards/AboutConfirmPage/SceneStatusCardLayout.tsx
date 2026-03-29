"use client";

import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";

export type SceneStatusItem = {
  scenename: string;
  users: string[];
};

type SceneStatusCardLayoutProps = {
  title: string;
  items: SceneStatusItem[];
};

export default function SceneStatusCardLayout({
  title,
  items,
}: SceneStatusCardLayoutProps) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: theme.palette.card.main,
        borderRadius: "10px",
        background: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          p: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography sx={{ color: "#E34013" }}>{title}</Typography>
        <Box
          sx={{
            background: "none",
            width: "100%",
            height: "100%",
          }}
        >
          {items.map((item, itemIndex) => (
            <Card
              key={`${item.scenename}-${itemIndex}`}
              variant="outlined"
              sx={{
                borderColor: theme.palette.card.main,
                background: "none",
                m: "16px",
                p: "16px",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={"16px"}
                sx={{ mb: "16px", width: "100%" }}
              >
                <Typography
                  sx={(theme) => ({
                    ...theme.typography.buttonFont2,
                    flexGrow: 1,
                  })}
                >
                  {item.scenename}
                </Typography>
              </Stack>
              {item.users.length === 0 ? (
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
                <Grid container spacing={"8px"}>
                  {item.users.map((user, userIndex) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      key={`${item.scenename}-${user}-${userIndex}`}
                    >
                      <Card
                        sx={{
                          background: theme.palette.card.main,
                          borderRadius: "15px",
                          color: "white",
                          width: "100%",
                          minHeight: 40,
                          px: "8px",
                          py: "8px",
                          m: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            color: "inherit",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {user}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Card>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
