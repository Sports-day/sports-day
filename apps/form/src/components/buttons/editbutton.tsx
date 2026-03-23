"use client";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

type Props = {
  type: string;
  sports: string;
  teams: string;
};

export default function EditButton({ type, sports, teams }: Props) {
  return (
    <Link
      href={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teams}`}
    >
      <Button
        component="span"
        variant="contained"
        sx={{
          borderWidth: "2px",
          borderColor: "#5B6DC6",
          background: "white",
          color: "#5B6DC6",
          "&:hover": {
            borderWidth: "2px",
            borderColor: "#5B6DC6",
            background: "white",
            color: "#5B6DC6",
            background: "white",
            opacity: 0.8,
          },
        }}
      >
        <EditIcon />
        編集
      </Button>
    </Link>
  );
}
