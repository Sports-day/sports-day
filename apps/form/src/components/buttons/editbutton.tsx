"use client";

import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { Typography, useTheme, Button } from "@mui/material";

type Props = {
  type: string;
  sports: string;
  teams: string;
};

export default function EditButton({ type, sports, teams }: Props) {
  const theme = useTheme();
  return (
    <Link
      href={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teams}`}
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
            opacity: 0.8,
          },
        }}
      >
        <EditIcon />
        <Typography
          sx={(theme) => ({
            ...theme.typography.buttonFont1,
          })}
        >
          編集
        </Typography>
      </Button>
    </Link>
  );
}
