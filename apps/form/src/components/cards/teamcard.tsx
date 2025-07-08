"use client";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TeamData } from "@/Data/TeamManagedata";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import CheckPopup from "../other/checkpopup";

export default function TeamCard({ teamname, teammember }: TeamData) {
  const [open, setOpen] = useState(false);
  const handleopen = () => {
    setOpen(true);
  };
  const [visible, setvisible] = useState(true);

  const handleClick = () => {
    setvisible(false);
  };
  return (
    visible && (
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          borderRadius: "10px",
          background: "#F4F5F9",
          boerderColor: "#5F6DC2",
          borderWidth: "2px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography>{teamname}</Typography>

          {teammember.map((item, index) => (
            <Card
              key={index}
              sx={{
                p: "1vh",
                width: "28vh",
                height: "3vh",
                background: "#5F6DC2",
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "white" }}>{item}</Typography>
            </Card>
          ))}
        </Stack>
        <Box sx={{ background: "#5B6DC6", p: "3%" }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{ background: "#6D7AE0", width: "14vh" }}
            >
              編集
            </Button>
            <Button
              variant="outlined"
              onClick={handleopen}
              sx={{
                borderWidth: "2px",
                borderColor: "#E4781A",
                background: "white",
                color: "#E4781A",
                width: "14vh",
              }}
            >
              削除
            </Button>
            <CheckPopup open={open} setOpen={setOpen} Delete={handleClick} />
          </Stack>
        </Box>
      </Card>
    )
  );
}
