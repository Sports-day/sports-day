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
  statusMessage?: string;
};

export default function SceneStatusCardLayout({
  title,
  items,
  statusMessage,
}: SceneStatusCardLayoutProps) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      component="fieldset"
      sx={{
        border: "1px solid",
        background: "none",

        borderColor: theme.palette.card.main,
        borderRadius: "10px",

        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Typography
        component="legend"
        sx={{
          color: "#FF0000",
          fontSize: "14px",
          fontWeight: "medium",
          ml: "4px",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          px: "16px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            background: "none",
            width: "100%",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            scrollbarGutter: "stable",
          }}
        >
          {statusMessage ? (
            <Stack
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography noWrap sx={{ maxWidth: '100%' }}>{statusMessage}</Typography>
            </Stack>
          ) : (
            <Stack spacing={"16px"}>
              {items.map((item, itemIndex) => (
                <Card
                  key={`${item.scenename}-${itemIndex}`}
                  variant="outlined"
                  sx={{
                    border: "1px solid",
                    background: "none",

                    borderColor: theme.palette.card.main,
                    borderRadius: "10px",

                    p: "16px",
                  }}
                >
                  <Typography
                    noWrap
                    sx={(theme) => ({
                      ...theme.typography.buttonFont2,
                      flexGrow: 1,
                      pb: "8px",
                    })}
                  >
                    {item.scenename}
                  </Typography>

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
                    <Box
                      sx={{
                        maxHeight: 220,
                        overflowY: "auto",
                        scrollbarGutter: "stable",
                        pr: "8px",
                      }}
                    >
                      <Grid container spacing={"8px"}>
                        {item.users.map((user, userIndex) => (
                          <Grid
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                            key={`${item.scenename}-${user}-${userIndex}`}
                            sx={{ minWidth: 0 }}
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
                                minWidth: 0,
                                overflow: "hidden",
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
                    </Box>
                  )}
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Card>
  );
}
