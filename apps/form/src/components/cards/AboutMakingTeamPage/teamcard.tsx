"use client";

import { Card, Box, Typography, Stack, Button, useTheme } from "@mui/material";
import { useState } from "react";
import CheckPopup from "../../popups/checkpopup";
import Link from "next/link";

type teamMember = {
  name: string;
};

type teamInformationProps = {
  teamid: string;
  teamname: string;
  type: string;
  sports: string;
  member: teamMember[];
};

export default function TeamCard({
  teamid,
  teamname,
  type,
  sports,
  member,
}: teamInformationProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const theme = useTheme();
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        minHeight: { xs: 260, md: 320 },
        width: "100%",
        borderRadius: "10px",
        background: theme.palette.card.light,
        borderColor: theme.palette.card.main,
        borderWidth: "1px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ pb: theme.spacing(1) }}>
        <Typography align="center">{teamname}</Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <Stack
          spacing={theme.spacing(1)}
          sx={{
            mx: theme.spacing(1),
          }}
        >
          {member.map((item, index) => (
            <Card
              key={index}
              sx={{
                background: theme.palette.card.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: theme.spacing(1),
                borderRadius: "10px",
              }}
            >
              <Typography sx={{ color: "white" }}>{item.name}</Typography>
            </Card>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          background: theme.palette.card.main,
          p: theme.spacing(1),
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Link
            href={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teamid}`}
            passHref
          >
            <Button
              component="span"
              variant="contained"
              sx={{
                borderRadius: "10px",
                background: theme.palette.button.light,
                "&:hover": {
                  borderRadius: "10px",
                  background: theme.palette.button.light,
                },
              }}
            >
              編集
            </Button>
          </Link>

          <Button
            variant="outlined"
            onClick={handleOpen}
            sx={{
              borderWidth: "2px",
              borderColor: "#E4781A",
              background: "white",
              color: "#E4781A",
              borderRadius: "10px",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#E4781A",
                background: "white",
                color: "#E4781A",
                borderRadius: "10px",
                opacity: 0.8,
              },
            }}
          >
            削除
          </Button>

          <CheckPopup teamid={teamid} open={open} setOpen={setOpen} />
        </Stack>
      </Box>
    </Card>
  );
}
