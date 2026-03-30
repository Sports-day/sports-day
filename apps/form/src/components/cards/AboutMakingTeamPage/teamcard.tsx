"use client";

import { Card, Box, Typography, Stack, Button, useTheme } from "@mui/material";
import { useState } from "react";
import CheckPopup from "../../popups/CheckPopup";
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
        height: { xs: 260, md: 320 },
        width: "100%",
        borderRadius: "10px",
        background: theme.palette.card.light,
        borderColor: theme.palette.card.main,
        borderWidth: "1px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ pb: "8px" }}>
        <Typography
          align="center"
          sx={(theme) => ({ ...theme.typography.buttonFont3 })}
        >
          {teamname}
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: "8px",
          pb: "8px",
        }}
      >
        <Stack spacing={"8px"}>
          {member.map((item, index) => (
            <Card
              key={index}
              sx={{
                background: theme.palette.card.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: "8px",
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
          background: "none",
          p: "8px",
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={"8px"}
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Link
            href={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teamid}`}
            passHref
            style={{ width: "100%" }}
          >
            <Button
              component="span"
              sx={{
                width: "100%",
                borderRadius: "10px",
                p: "4px",
                color: "#ffffff",
                background: theme.palette.button.main,
                "&:hover": {
                  width: "100%",
                  borderRadius: "10px",
                  p: "4px",
                  color: "#ffffff",
                  background: theme.palette.button.main,
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
              p: "4px",
              width: "100%",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#E4781A",
                background: "white",
                color: "#E4781A",
                borderRadius: "10px",
                p: "4px",
                width: "100%",
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
