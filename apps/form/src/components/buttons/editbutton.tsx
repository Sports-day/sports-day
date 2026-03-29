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
        sx={{
          borderRadius: "10px",
          p: "4px",
          width: "100%",
          background: theme.palette.button.light,
          "&:hover": {
            borderRadius: "10px",
            p: "4px",
            width: "100%",
            background: theme.palette.button.light,
            opacity: 0.8,
          },
        }}
      >
        <EditIcon sx={{ color: theme.typography.buttonFont1.color }} />
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
