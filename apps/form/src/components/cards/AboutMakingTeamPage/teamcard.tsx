"use client";

import { Card, Box, Typography, Stack, Button } from "@mui/material";
import { useState } from "react";
import CheckPopup from "../../popups/checkpopup";
import Link from "next/link";
import { motion } from "framer-motion";

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

  return (
    <Card
      variant="outlined"
      sx={{
        height: "55vh",
        width: "100%",
        borderRadius: "10px",
        background: "#EFF0F8",
        borderColor: "#5F6DC2",
        borderWidth: "2px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography align="center">{teamname}</Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
        }}
      >
        <Stack spacing={1}>
          {member.map((item, index) => (
            <Card
              key={index}
              sx={{
                p: "1%",
                background: "#5F6DC2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "white" }}>{item.name}</Typography>
            </Card>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          background: "#5F6DC2",
          p: "3%",
          mt: "auto",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Link
            href={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teamid}`}
            passHref
          >
            <Button
              component="span"
              variant="contained"
              sx={{
                background: "#6D7AE080",
                "&:hover": { background: "#6D7AE080" },
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
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#E4781A",
                background: "white",
                color: "#E4781A",
                background: "white",
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
